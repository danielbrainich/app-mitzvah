import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    RefreshControl,
    Linking,
    TouchableOpacity,
    AppState,
    Alert,
    Modal,
    Pressable,
} from "react-native";
import {
    HebrewCalendar,
    Location,
    CandleLightingEvent,
    ParshaEvent,
    HavdalahEvent,
    HDate,
    Zmanim,
} from "@hebcal/core";
import { useFonts } from "expo-font";
import * as ExpoLocation from "expo-location";
import { useSelector } from "react-redux";
import InfoModal from "../InfoModal";

// Dev-only override for testing specific dates.
// Examples:
//   • Normal Shabbat (with Havdalah): 2026-09-18
//   • Shabbat → Yom Tov (no Havdalah): 2026-09-25  // Erev Sukkot
const TEST_TODAY_ISO = __DEV__ ? "2026-09-25" : null; // set to null when done

function addMinutes(date, mins) {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() + mins);
    return d;
}

function ceilToMinute(date) {
    const d = new Date(date);
    const hadSeconds = d.getSeconds() > 0 || d.getMilliseconds() > 0;
    d.setSeconds(0, 0);
    if (hadSeconds) d.setMinutes(d.getMinutes() + 1);
    return d;
}

// Local YYYY-MM-DD (not UTC) to avoid date drifting around midnight/timezones.
function localIsoToday() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

function getTodayIso() {
    if (__DEV__ && TEST_TODAY_ISO) return TEST_TODAY_ISO;
    return localIsoToday();
}

// Parse YYYY-MM-DD into a local Date at midnight.
function localDateFromIso(iso) {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d, 0, 0, 0, 0);
}

function formatTime(date) {
    const hours = date.getHours();
    const minutes =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    const amPm = hours >= 12 ? "pm" : "am";
    const formattedHour = hours % 12 === 0 ? 12 : hours % 12;
    return `${formattedHour}:${minutes} ${amPm}`;
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
});

function msUntilNextLocalMidnight() {
    const now = new Date();
    const next = new Date(now);
    next.setDate(now.getDate() + 1);
    next.setHours(0, 0, 0, 0);
    return next.getTime() - now.getTime();
}

// Compare two Date objects by local calendar day only.
function isSameLocalDate(a, b) {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

/**
 * Compute Friday times from Zmanim:
 * - sunset is rounded up to a minute (ceil)
 * - candle lighting = sundown - (user setting, default 18)
 */
function getFridayTimesFromZmanim({
    location,
    timezone,
    friday,
    candleOffsetMins,
}) {
    if (!location) return {};

    const elevation = Number.isFinite(location.elevation)
        ? location.elevation
        : undefined;

    const hebcalLocation = new Location(
        location.latitude,
        location.longitude,
        false,
        timezone,
        undefined,
        "US",
        undefined,
        elevation
    );

    const zmanim = new Zmanim(hebcalLocation, friday);

    const sunsetRaw = zmanim.sunset();
    if (!(sunsetRaw instanceof Date)) return {};

    const sunset = ceilToMinute(sunsetRaw);

    const offset =
        candleOffsetMins !== null && candleOffsetMins !== undefined
            ? candleOffsetMins
            : 18;

    const candleDateTime = addMinutes(sunset, -offset);

    return {
        sundownFriday: formatTime(sunset),
        candleTime: formatTime(candleDateTime),
    };
}

/**
 * Compute Saturday times from Zmanim:
 * - sunset is rounded up to a minute (ceil)
 * - shabbat ends = sunset + havdalah mins
 */
function getSaturdayTimesFromZmanim({
    location,
    timezone,
    saturday,
    havdalahMins,
}) {
    if (!location) return {};

    const elevation = Number.isFinite(location.elevation)
        ? location.elevation
        : undefined;

    const hebcalLocation = new Location(
        location.latitude,
        location.longitude,
        false,
        timezone,
        undefined,
        "US",
        undefined,
        elevation
    );

    const zmanim = new Zmanim(hebcalLocation, saturday);

    const sunsetRaw = zmanim.sunset();
    if (!(sunsetRaw instanceof Date)) return {};

    const sunset = ceilToMinute(sunsetRaw);
    const ends = addMinutes(sunset, havdalahMins ?? 42);

    return {
        sundownSaturday: formatTime(sunset),
        shabbatEnds: formatTime(ends),
    };
}

function getShabbatInfo(events, friday, saturday) {
    const shabbatInfo = {
        endsIntoYomTov: false,
        yomTovCandleTime: null,
    };

    // Dev-only, structured logging
    if (__DEV__) {
        console.group(`[Shabbat] Hebcal events (${events?.length ?? 0})`);
        (events || []).forEach((e, i) => {
            const desc =
                typeof e?.getDesc === "function"
                    ? e.getDesc()
                    : typeof e?.render === "function"
                    ? e.render("en")
                    : String(e);

            const when =
                e?.eventTime instanceof Date
                    ? ` @ ${e.eventTime.toLocaleString()}`
                    : "";
            console.log(`${String(i + 1).padStart(2, "0")}. ${desc}${when}`);
        });
        console.groupEnd();
    }

    const fridayCandleEvents = [];
    const saturdayCandleEvents = [];

    for (const event of events || []) {
        if (event instanceof CandleLightingEvent) {
            if (!(event.eventTime instanceof Date)) continue;

            if (isSameLocalDate(event.eventTime, friday)) {
                fridayCandleEvents.push(event);
                continue;
            }
            if (isSameLocalDate(event.eventTime, saturday)) {
                saturdayCandleEvents.push(event);
                continue;
            }
        }

        if (event instanceof HavdalahEvent) {
            if (!(event.eventTime instanceof Date)) continue;
            if (!isSameLocalDate(event.eventTime, saturday)) continue;

            shabbatInfo.havdalahDesc = event.renderBrief("he-x-NoNikud");
            shabbatInfo.havdalahTime = event.fmtTime || null;
            continue;
        }

        if (event instanceof ParshaEvent) {
            shabbatInfo.parshaEnglish = event.render("en");
            shabbatInfo.parshaHebrew = event.renderBrief("he-x-NoNikud");
            shabbatInfo.parshaHDate = event.date ? event.date.toString() : null;
            continue;
        }
    }

    // If we have a Saturday candle lighting, Shabbat is ending into Yom Tov.
    shabbatInfo.endsIntoYomTov = saturdayCandleEvents.length > 0;

    // Choose Friday candle lighting (for descriptive text + Hebrew date only)
    const chosenFridayCandle =
        fridayCandleEvents.find((e) => !e.linkedEvent) || fridayCandleEvents[0];

    if (chosenFridayCandle) {
        shabbatInfo.candleDesc = chosenFridayCandle.renderBrief("he-x-NoNikud");
        shabbatInfo.candleHDate = chosenFridayCandle.date
            ? chosenFridayCandle.date.toString()
            : null;
    }

    return shabbatInfo;
}

export default function Shabbat() {
    const [fontsLoaded] = useFonts({
        Nayuki: require("../../assets/fonts/NayukiRegular.otf"),
    });

    const [location, setLocation] = useState(null);
    const [locationStatus, setLocationStatus] = useState("unknown"); // "granted" | "denied" | "unknown"
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [shabbatInfo, setShabbatInfo] = useState(null);
    const [showLocationDetails, setShowLocationDetails] = useState(false);

    const { dateDisplay, candleLightingTime, havdalahTime } = useSelector(
        (state) => state.settings
    );

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const timeoutIdRef = useRef(null);

    const openSettings = useCallback(() => {
        Linking.openSettings().catch(() => {
            Alert.alert("Unable to open settings");
        });
    }, []);

    const checkPermissionsAndFetchLocation = useCallback(async () => {
        try {
            const { status } =
                await ExpoLocation.requestForegroundPermissionsAsync();

            if (status !== "granted") {
                setLocationStatus("denied");
                setLocation(null);
                if (__DEV__)
                    console.log("[Shabbat] Location permission not granted");
                return;
            }

            setLocationStatus("granted");
            const pos = await ExpoLocation.getCurrentPositionAsync({});
            setLocation({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
                elevation: pos.coords.altitude,
            });
        } catch (error) {
            console.error("[Shabbat] Error fetching location:", error);
            setLocationStatus("denied");
            setLocation(null);
        }
    }, []);

    useEffect(() => {
        checkPermissionsAndFetchLocation();

        const subscription = AppState.addEventListener(
            "change",
            (nextState) => {
                if (nextState === "active") {
                    checkPermissionsAndFetchLocation();
                }
            }
        );

        return () => subscription.remove();
    }, [checkPermissionsAndFetchLocation]);

    const fetchShabbatInfo = useCallback(async () => {
        try {
            setLoading(true);

            const todayIso = getTodayIso();
            const today = localDateFromIso(todayIso);

            const friday = new Date(today);
            const saturday = new Date(today);

            if (today.getDay() === 6) {
                // Saturday: current Shabbat
                friday.setDate(today.getDate() - 1);
                saturday.setDate(today.getDate());
            } else {
                // Upcoming Shabbat
                friday.setDate(today.getDate() + (5 - today.getDay()));
                saturday.setTime(friday.getTime());
                saturday.setDate(friday.getDate() + 1);
            }

            const erevShabbatDate = dateFormatter.format(friday);
            const yomShabbatDate = dateFormatter.format(saturday);

            const erevShabbatHebrewDate = new HDate(friday).toString();
            const yomShabbatHebrewDate = new HDate(saturday).toString();

            // IMPORTANT: include Saturday night (use Sunday 00:00 local)
            const end = new Date(saturday);
            end.setDate(end.getDate() + 1);
            end.setHours(0, 0, 0, 0);

            let events;
            if (location) {
                const elevation = Number.isFinite(location.elevation)
                    ? location.elevation
                    : undefined;

                const hebcalLocation = new Location(
                    location.latitude,
                    location.longitude,
                    false,
                    timezone,
                    undefined,
                    "US",
                    undefined,
                    elevation
                );

                events = HebrewCalendar.calendar({
                    start: friday,
                    end,
                    location: hebcalLocation,
                    candlelighting: true,
                    havdalahMins: havdalahTime,
                    candleLightingMins: 1,
                    sedrot: true,
                });
            } else {
                events = HebrewCalendar.calendar({
                    start: friday,
                    end,
                    sedrot: true,
                });
            }

            const parsed = getShabbatInfo(events, friday, saturday);

            const friTimes = getFridayTimesFromZmanim({
                location,
                timezone,
                friday,
                candleOffsetMins: candleLightingTime,
            });

            const satTimes = getSaturdayTimesFromZmanim({
                location,
                timezone,
                saturday,
                havdalahMins: havdalahTime,
            });

            const yomTovCandleTime =
                parsed?.endsIntoYomTov && satTimes?.shabbatEnds
                    ? satTimes.shabbatEnds
                    : null;

            setShabbatInfo({
                ...parsed,

                sundownFriday: friTimes?.sundownFriday ?? null,
                candleTime: friTimes?.candleTime ?? null,

                sundownSaturday: satTimes?.sundownSaturday ?? null,
                shabbatEnds: satTimes?.shabbatEnds ?? null,

                yomTovCandleTime: yomTovCandleTime ?? null,

                erevShabbatDate,
                erevShabbatHebrewDate,
                yomShabbatDate,
                yomShabbatHebrewDate,
                todayIso,
            });
        } catch (error) {
            console.error("[Shabbat] Error fetching Shabbat info:", error);
        } finally {
            setLoading(false);
        }
    }, [location, timezone, havdalahTime, candleLightingTime]);

    useEffect(() => {
        fetchShabbatInfo();
    }, [fetchShabbatInfo]);

    useEffect(() => {
        const schedule = () => {
            if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);

            timeoutIdRef.current = setTimeout(() => {
                fetchShabbatInfo();
                schedule(); // reschedule next midnight
            }, msUntilNextLocalMidnight());
        };

        schedule();

        return () => {
            if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
        };
    }, [fetchShabbatInfo]);

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchShabbatInfo();
        setRefreshing(false);
    }, [fetchShabbatInfo]);

    const hasLocation = !!location && locationStatus === "granted";

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.scrollViewContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                    />
                }
            >
                {fontsLoaded ? (
                    <View style={styles.frame}>
                        {shabbatInfo ? (
                            <>
                                <Text style={styles.headerText}>This week</Text>

                                {/* Erev Shabbat */}
                                <Text style={styles.mediumBoldText}>
                                    Erev Shabbat
                                </Text>

                                <Text style={styles.sentence}>
                                    Erev Shabbat is{" "}
                                    <Text style={styles.highlight}>
                                        {dateDisplay === "gregorian"
                                            ? shabbatInfo.erevShabbatDate
                                            : shabbatInfo.erevShabbatHebrewDate}
                                    </Text>
                                    .
                                </Text>

                                {shabbatInfo.candleTime && (
                                    <Text style={styles.sentence}>
                                        Candle lighting is at{" "}
                                        <Text style={styles.highlight}>
                                            {shabbatInfo.candleTime}
                                        </Text>
                                        .
                                    </Text>
                                )}

                                {shabbatInfo.sundownFriday && (
                                    <Text style={styles.sentence}>
                                        Sundown is{" "}
                                        <Text style={styles.highlight}>
                                            {shabbatInfo.sundownFriday}
                                        </Text>
                                        .
                                    </Text>
                                )}

                                <View style={styles.spacer} />

                                {/* Yom Shabbat */}
                                <Text style={styles.mediumBoldText}>
                                    Yom Shabbat
                                </Text>

                                <Text style={styles.sentence}>
                                    Yom Shabbat is{" "}
                                    <Text style={styles.highlight}>
                                        {dateDisplay === "gregorian"
                                            ? shabbatInfo.yomShabbatDate
                                            : shabbatInfo.yomShabbatHebrewDate}
                                    </Text>
                                    .
                                </Text>

                                {shabbatInfo.sundownSaturday && (
                                    <Text style={styles.sentence}>
                                        Sundown is{" "}
                                        <Text style={styles.highlight}>
                                            {shabbatInfo.sundownSaturday}
                                        </Text>
                                        .
                                    </Text>
                                )}

                                {shabbatInfo.shabbatEnds &&
                                    !shabbatInfo.endsIntoYomTov && (
                                        <Text style={styles.sentence}>
                                            Havdalah is{" "}
                                            <Text style={styles.highlight}>
                                                {shabbatInfo.shabbatEnds}
                                            </Text>
                                            .
                                        </Text>
                                    )}

                                {shabbatInfo.endsIntoYomTov && (
                                    <>
                                        {shabbatInfo.yomTovCandleTime && (
                                            <Text style={styles.sentence}>
                                                Shabbat ends into Yom Tov. Light
                                                candles at{" "}
                                                <Text style={styles.highlight}>
                                                    {
                                                        shabbatInfo.yomTovCandleTime
                                                    }
                                                </Text>
                                                .
                                            </Text>
                                        )}

                                        <Text
                                            style={[
                                                styles.sentence,
                                                styles.muted,
                                            ]}
                                        >
                                            Havdalah is included in Kiddush, and
                                            the holiday Torah reading replaces
                                            the weekly parsha.
                                        </Text>
                                    </>
                                )}

                                {/* Parasha (only if not ending into Yom Tov) */}
                                {shabbatInfo.parshaEnglish &&
                                    !shabbatInfo.endsIntoYomTov && (
                                        <>
                                            <View style={styles.spacer} />

                                            <Text style={styles.mediumBoldText}>
                                                Parasha
                                            </Text>

                                            <Text style={styles.sentence}>
                                                This week is{" "}
                                                <Text style={styles.highlight}>
                                                    {shabbatInfo.parshaEnglish}
                                                </Text>
                                                {shabbatInfo.parshaHebrew ? (
                                                    <>
                                                        {" "}
                                                        (
                                                        <Text
                                                            style={
                                                                styles.highlight
                                                            }
                                                        >
                                                            {
                                                                shabbatInfo.parshaHebrew
                                                            }
                                                        </Text>
                                                        )
                                                    </>
                                                ) : null}
                                                .
                                            </Text>
                                        </>
                                    )}
                            </>
                        ) : (
                            <Text style={styles.paragraphText}>
                                {loading
                                    ? "Loading Shabbat info..."
                                    : "No Shabbat info."}
                            </Text>
                        )}

                        <View style={styles.spacer} />

                        {/* Location notice / pill */}
                        {!hasLocation && (
                            <View style={styles.locationNotice}>
                                <Text style={styles.locationNoticeTitle}>
                                    Location is off
                                </Text>
                                <Text style={styles.locationNoticeBody}>
                                    Candle lighting, sundown, and havdalah times
                                    use your device’s location. Turn on location
                                    services to see those times.
                                </Text>

                                <TouchableOpacity
                                    onPress={openSettings}
                                    style={styles.cta}
                                >
                                    <Text style={styles.ctaText}>
                                        Open Settings
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {hasLocation && (
                            <View style={styles.debugRow}>
                                <Pressable
                                    onPress={() => setShowLocationDetails(true)}
                                    style={styles.debugPill}
                                >
                                    <Text style={styles.debugPillText}>
                                        Location Enabled
                                    </Text>
                                </Pressable>
                            </View>
                        )}

                        {/* Location modal */}
                        <InfoModal
                            visible={showLocationDetails}
                            onClose={() => setShowLocationDetails(false)}
                            title="Your Location"
                        >
                            <View style={styles.modalLine}>
                                <Text style={styles.modalLabel}>Timezone</Text>
                                <Text style={styles.modalValue}>
                                    {timezone.replace(/_/g, " ")}
                                </Text>
                            </View>

                            <View style={styles.modalLine}>
                                <Text style={styles.modalLabel}>
                                    Coordinates
                                </Text>
                                <Text style={styles.modalValue}>
                                    {hasLocation
                                        ? `${location.latitude.toFixed(
                                              3
                                          )}, ${location.longitude.toFixed(3)}`
                                        : "Unavailable"}
                                </Text>
                            </View>

                            <View style={styles.modalLine}>
                                <Text style={styles.modalLabel}>Elevation</Text>
                                <Text style={styles.modalValue}>
                                    {hasLocation &&
                                    Number.isFinite(location.elevation)
                                        ? `${location.elevation.toFixed(
                                              1
                                          )} meters`
                                        : "Unknown"}
                                </Text>
                            </View>
                        </InfoModal>
                    </View>
                ) : null}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "flex-start",
        justifyContent: "flex-start",
        backgroundColor: "black",
    },
    scrollViewContent: {
        flex: 1,
        alignSelf: "stretch",
    },
    frame: {
        padding: 20,
        paddingTop: 40,
    },
    spacer: {
        marginBottom: 18,
    },
    mediumBoldText: {
        color: "#82CBFF",
        fontFamily: "Nayuki",
        fontSize: 42,
        marginBottom: 16,
    },
    list: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    listColumn: {
        flexDirection: "column",
        justifyContent: "flex-start",
        marginBottom: 16,
    },
    paragraphText: {
        color: "white",
        fontSize: 20,
        marginBottom: 8,
    },
    noteText: {
        color: "white",
        fontSize: 14,
        marginBottom: 8,
        opacity: 0.85,
        lineHeight: 18,
    },
    headerText: {
        color: "white",
        fontSize: 30,
        marginBottom: 22,
    },

    locationNotice: {
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.25)",
        borderRadius: 12,
        padding: 14,
        marginBottom: 22,
        backgroundColor: "black",
    },
    locationNoticeTitle: {
        color: "white",
        fontSize: 16,
        marginBottom: 6,
        fontWeight: "500",
    },
    locationNoticeBody: {
        color: "white",
        opacity: 0.9,
        fontSize: 14,
        lineHeight: 18,
        marginBottom: 10,
    },
    locationNoticeSmall: {
        color: "white",
        opacity: 0.7,
        fontSize: 12,
        marginTop: 10,
    },
    cta: {
        borderWidth: 0.5,
        borderColor: "#82CBFF",
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 12,
        alignSelf: "flex-start",
    },
    ctaText: {
        color: "#82CBFF",
        fontSize: 12,
        fontWeight: "600",
    },

    debugRow: {
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
    },
    debugPill: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.20)",
        borderRadius: 999,
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    debugPillText: {
        color: "white",
        fontSize: 14,
        opacity: 0.9,
    },

    modalBackdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.65)",
        justifyContent: "center",
        padding: 18,
    },
    modalCard: {
        borderWidth: 1,
        borderColor: "rgba(130,203,255,0.35)",
        backgroundColor: "rgba(0,0,0,0.92)",
        borderRadius: 14,
        padding: 16,
    },
    modalTitle: {
        color: "white",
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 14,
    },
    modalLine: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    modalLabel: {
        color: "white",
        opacity: 0.75,
        fontSize: 14,
    },
    modalValue: {
        color: "#82CBFF",
        fontSize: 14,
        maxWidth: "60%",
        textAlign: "right",
    },
    modalClose: {
        marginTop: 16,
        alignSelf: "flex-end",
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    modalCloseText: {
        color: "#82CBFF",
        fontSize: 14,
        fontWeight: "600",
    },
    sentence: {
        color: "rgba(255,255,255,0.92)",
        fontSize: 18,
        lineHeight: 26,
        marginBottom: 10,
    },
    highlight: {
        color: "#82CBFF",
        fontWeight: "600",
    },
    muted: {
        color: "rgba(255,255,255,0.75)",
    },
});
