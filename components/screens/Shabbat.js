import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Linking,
    TouchableOpacity,
    AppState,
    Alert,
    Pressable,
    ScrollView,
} from "react-native";
import {
    HebrewCalendar,
    Location,
    CandleLightingEvent,
    ParshaEvent,
    HavdalahEvent,
    HDate,
    Zmanim,
    Event, // needed to detect holidays on Shabbat even when location is off
} from "@hebcal/core";
import { useFonts } from "expo-font";
import * as ExpoLocation from "expo-location";
import { useSelector } from "react-redux";
import BottomSheetDrawer from "../BottomSheetDrawer";
import { SafeAreaView } from "react-native-safe-area-context";
import { ui } from "../../styles/theme";

// -----------------------------------------------------------------------------
// Notes:
// - All date/time logic here is intentionally local time (not UTC) to avoid
//   drifting around midnight or across timezones.
// - We refresh Shabbat info on: mount, app foreground, and the next local midnight.
// -----------------------------------------------------------------------------

// Dev-only override for testing specific dates.
// Examples:
//   • Normal Shabbat (with Havdalah): "2026-09-18"
//   • Shabbat → Yom Tov (no Havdalah): "2026-09-25"  // Erev Sukkot
const TEST_TODAY_ISO = __DEV__ ? null : null; // set to null when done

// Add minutes to a Date without mutating the original Date.
// Used for "candle lighting = sunset - offset" and "havdalah = sunset + mins".
function addMinutes(date, mins) {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() + mins);
    return d;
}

// Round up to the next whole minute.
// Useful because zmanim can have seconds/millis and we want clean display times.
function ceilToMinute(date) {
    const d = new Date(date);
    const hadSeconds = d.getSeconds() > 0 || d.getMilliseconds() > 0;
    d.setSeconds(0, 0);
    if (hadSeconds) d.setMinutes(d.getMinutes() + 1);
    return d;
}

// Local YYYY-MM-DD (not UTC) so “today” matches the user’s timezone.
function localIsoToday() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

// Dev-friendly “today”: uses TEST_TODAY_ISO in development when set, otherwise local today.
function getTodayIso() {
    if (__DEV__ && TEST_TODAY_ISO) return TEST_TODAY_ISO;
    return localIsoToday();
}

// Convert YYYY-MM-DD to a local Date at midnight.
// Avoids timezone drift that can happen when parsing ISO strings directly.
function localDateFromIso(iso) {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d, 0, 0, 0, 0);
}

// Format a Date for display (12h clock).
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

// Milliseconds until next local midnight.
// We refresh at midnight so "today/upcoming Shabbat" flips correctly.
function msUntilNextLocalMidnight() {
    const now = new Date();
    const next = new Date(now);
    next.setDate(now.getDate() + 1);
    next.setHours(0, 0, 0, 0);
    return next.getTime() - now.getTime();
}

// Compare two Date objects by local calendar day only (ignores time of day).
function isSameLocalDate(a, b) {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

/**
 * Compute Friday times from Zmanim.
 * Used as a fallback display time when Hebcal candle-lighting events are missing.
 *
 * Inputs:
 * - location/timezone: for accurate zmanim
 * - friday: the Friday date
 * - candleOffsetMins: user setting (defaults to 18 if null/undefined)
 *
 * Output:
 * - sundownFriday + candleTime as formatted strings
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
 * Compute Saturday times from Zmanim.
 * Used as a fallback display time when Hebcal havdalah events are missing.
 *
 * Inputs:
 * - location/timezone: for accurate zmanim
 * - saturday: the Saturday date
 * - havdalahMins: user setting (defaults to 42 if null/undefined)
 *
 * Output:
 * - sundownSaturday + shabbatEnds as formatted strings
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

/**
 * Extracts the display/logic signals we need from Hebcal events:
 * - Candle lighting (Friday + Saturday if Shabbat flows into Yom Tov)
 * - Havdalah info
 * - Parsha info (if present)
 * - Detects "holiday on Shabbat day" even when location is OFF (no candle events)
 *
 * This function does NOT compute times itself; it reads what Hebcal provides.
 */
function getShabbatInfo(events, friday, saturday) {
    const shabbatInfo = {
        endsIntoYomTov: false,
        yomTovCandleTime: null,

        // lets us show "Note" even when location is OFF and Hebcal omits ParshaEvent
        parshaReplacedByHoliday: false,
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

    // track “holiday on Shabbat day” events (does not require location)
    let foundHolidayOnSaturday = false;

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

        // detect a holiday/CH"M event that falls on the Saturday date
        // This is the key fix for "location off" + "no parsha" weeks.
        if (!foundHolidayOnSaturday && event instanceof Event) {
            const d =
                typeof event.getDate === "function" ? event.getDate() : null;
            const g = d && typeof d.greg === "function" ? d.greg() : null;

            if (g instanceof Date && isSameLocalDate(g, saturday)) {
                const cats =
                    typeof event.getCategories === "function"
                        ? event.getCategories()
                        : [];

                // Heuristic: treat major + chol_hamoed as “parsha replaced”
                if (cats.includes("major") || cats.includes("chol_hamoed")) {
                    foundHolidayOnSaturday = true;
                }
            }
        }
    }

    // If we have a Saturday candle lighting, Shabbat is ending into Yom Tov.
    shabbatInfo.endsIntoYomTov = saturdayCandleEvents.length > 0;

    // if no parsha event and we detected a holiday on Shabbat day, treat it like a "Note" week
    shabbatInfo.parshaReplacedByHoliday =
        !shabbatInfo.parshaEnglish && foundHolidayOnSaturday;

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
    const [loading, setLoading] = useState(true);
    const [shabbatInfo, setShabbatInfo] = useState(null);
    const [showLocationDetails, setShowLocationDetails] = useState(false);

    const { candleLightingTime, havdalahTime } = useSelector(
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

    // Refresh once at the next local midnight. Re-schedules after each run.
    useEffect(() => {
        if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);

        timeoutIdRef.current = setTimeout(() => {
            fetchShabbatInfo();

            // schedule the next midnight tick
            if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
            timeoutIdRef.current = setTimeout(
                fetchShabbatInfo,
                msUntilNextLocalMidnight()
            );
        }, msUntilNextLocalMidnight());

        return () => {
            if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
        };
    }, [fetchShabbatInfo]);

    const hasLocation = !!location && locationStatus === "granted";

    return (
        <SafeAreaView style={ui.shabbatContainer}>
            <ScrollView style={ui.screen}>
                {!fontsLoaded ? null : (
                    <>
                        <Text
                            style={[
                                ui.shabbatPageHeader,
                                { fontFamily: "Nayuki" },
                            ]}
                        >
                            Shabbat
                        </Text>

                        {shabbatInfo ? (
                            <>
                                {/* Erev Shabbat card */}
                                <View style={ui.card}>
                                    <Text style={ui.cardTitle}>
                                        Erev Shabbat
                                    </Text>

                                    <Text style={ui.shabbatSentence}>
                                        {shabbatInfo.erevShabbatDate}
                                    </Text>

                                    {shabbatInfo.candleTime ? (
                                        <Text style={ui.shabbatSentence}>
                                            Candle lighting at{" "}
                                            <Text style={ui.shabbatHighlight}>
                                                {shabbatInfo.candleTime}
                                            </Text>
                                        </Text>
                                    ) : null}

                                    {shabbatInfo.sundownFriday ? (
                                        <Text style={ui.shabbatSentence}>
                                            Sundown at{" "}
                                            <Text style={ui.shabbatHighlight}>
                                                {shabbatInfo.sundownFriday}
                                            </Text>
                                        </Text>
                                    ) : null}
                                </View>

                                {/* Yom Shabbat card */}
                                <View style={ui.card}>
                                    <Text style={ui.cardTitle}>
                                        Yom Shabbat
                                    </Text>

                                    <Text style={ui.shabbatSentence}>
                                        {shabbatInfo.yomShabbatDate}
                                    </Text>

                                    {/* Normal week: Havdalah */}
                                    {shabbatInfo.shabbatEnds &&
                                    !shabbatInfo.endsIntoYomTov ? (
                                        <Text style={ui.shabbatSentence}>
                                            Havdalah at{" "}
                                            <Text style={ui.shabbatHighlight}>
                                                {shabbatInfo.shabbatEnds}
                                            </Text>{" "}
                                        </Text>
                                    ) : null}

                                    {/* Shabbat ends into Yom Tov */}
                                    {shabbatInfo.endsIntoYomTov ? (
                                        <>
                                            {shabbatInfo.yomTovCandleTime ? (
                                                <Text
                                                    style={ui.shabbatSentence}
                                                >
                                                    Holiday candle lighting at{" "}
                                                    <Text
                                                        style={
                                                            ui.shabbatHighlight
                                                        }
                                                    >
                                                        {
                                                            shabbatInfo.yomTovCandleTime
                                                        }
                                                    </Text>
                                                </Text>
                                            ) : (
                                                <Text
                                                    style={[
                                                        ui.shabbatSentence,
                                                        ui.shabbatMuted,
                                                    ]}
                                                >
                                                    Shabbat ends into Yom Tov
                                                </Text>
                                            )}
                                        </>
                                    ) : null}

                                    {shabbatInfo.sundownSaturday ? (
                                        <Text style={ui.shabbatSentence}>
                                            Sundown at{" "}
                                            <Text style={ui.shabbatHighlight}>
                                                {shabbatInfo.sundownSaturday}
                                            </Text>
                                        </Text>
                                    ) : null}
                                </View>

                                {/* Parasha card */}
                                <View style={ui.card}>
                                    {shabbatInfo.endsIntoYomTov ||
                                    shabbatInfo.parshaReplacedByHoliday ? (
                                        <Text style={ui.shabbatSentenceSmall}>
                                            Because a holiday begins Saturday
                                            evening, holiday candle lighting
                                            replaces Havdalah and the holiday
                                            Torah reading replaces the Parasha.
                                        </Text>
                                    ) : shabbatInfo.parshaEnglish ? (
                                        <>
                                            <Text style={ui.cardTitle}>
                                                Parasha
                                            </Text>
                                            <Text style={ui.shabbatSentence}>
                                                {shabbatInfo.parshaEnglish}
                                            </Text>

                                            {shabbatInfo.parshaHebrew ? (
                                                <Text
                                                    style={ui.shabbatSentence}
                                                >
                                                    {shabbatInfo.parshaHebrew}
                                                </Text>
                                            ) : null}
                                        </>
                                    ) : (
                                        <Text
                                            style={[
                                                ui.shabbatSentence,
                                                ui.shabbatMuted,
                                            ]}
                                        >
                                            Parasha info unavailable
                                        </Text>
                                    )}
                                </View>
                            </>
                        ) : (
                            <View style={ui.card}>
                                <Text style={ui.shabbatSentence}>
                                    {loading
                                        ? "Loading Shabbat info..."
                                        : "No Shabbat info."}
                                </Text>
                            </View>
                        )}

                        {/* Bottom sheet for location details */}
                        <BottomSheetDrawer
                            visible={showLocationDetails}
                            onClose={() => setShowLocationDetails(false)}
                            title="Your Location"
                            snapPoints={["30%", "45%"]}
                        >
                            <View style={ui.shabbatSheetLine}>
                                <Text style={ui.shabbatSheetLabel}>
                                    Timezone
                                </Text>
                                <Text style={ui.shabbatSheetValue}>
                                    {timezone.replace(/_/g, " ")}
                                </Text>
                            </View>

                            <View style={ui.shabbatSheetLine}>
                                <Text style={ui.shabbatSheetLabel}>
                                    Coordinates
                                </Text>
                                <Text style={ui.shabbatSheetValue}>
                                    {hasLocation
                                        ? `${location.latitude.toFixed(
                                              3
                                          )}, ${location.longitude.toFixed(3)}`
                                        : "Unavailable"}
                                </Text>
                            </View>

                            <View style={ui.shabbatSheetLine}>
                                <Text style={ui.shabbatSheetLabel}>
                                    Elevation
                                </Text>
                                <Text style={ui.shabbatSheetValue}>
                                    {hasLocation &&
                                    Number.isFinite(location.elevation)
                                        ? `${location.elevation.toFixed(
                                              1
                                          )} meters`
                                        : "Unknown"}
                                </Text>
                            </View>
                        </BottomSheetDrawer>
                    </>
                )}

                <View style={ui.shabbatFooter}>
                    {!hasLocation && (
                        <View style={ui.shabbatLocationNotice}>
                            <Text style={ui.shabbatLocationNoticeTitle}>
                                Location is off
                            </Text>
                            <Text style={ui.shabbatLocationNoticeBody}>
                                Candle lighting, sundown, and havdalah times use
                                your device’s location. Turn on location
                                services to see those times
                            </Text>

                            <TouchableOpacity
                                onPress={openSettings}
                                style={ui.shabbatCta}
                            >
                                <Text style={ui.shabbatCtaText}>
                                    Open Settings
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ScrollView>

            {hasLocation && (
                <Pressable
                    onPress={() => setShowLocationDetails(true)}
                    style={ui.shabbatLocationChip}
                    hitSlop={12}
                >
                    <View style={ui.shabbatGreenDot} />
                    <Text style={ui.shabbatLocationChipText}>Location</Text>
                </Pressable>
            )}
        </SafeAreaView>
    );
}
