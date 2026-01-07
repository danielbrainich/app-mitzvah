// screens/Shabbat.js
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    View,
    Text,
    Linking,
    TouchableOpacity,
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
    Event, // detect holidays on Shabbat even when location is off
} from "@hebcal/core";
import { useFonts } from "expo-font";
import { useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import useAppLocation from "../../hooks/useAppLocation";
import BottomSheetDrawer from "../BottomSheetDrawer";
import { ui } from "../../styles/theme";
import useTodayIso from "../../utils/useTodayIso";
import {
    parseLocalIso,
    formatTime12h,
    formatGregorianLong,
    isSameLocalDate,
    addMinutes,
    ceilToMinute
} from "../../utils/datetime";

// DEV-only override for testing specific dates: "YYYY-MM-DD"
const TEST_TODAY_ISO = __DEV__ ? null : null;

/**
 * Compute Friday times from Zmanim.
 * Fallback display when Hebcal candle-lighting events are missing.
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
        sundownFriday: formatTime12h(sunset),
        candleTime: formatTime12h(candleDateTime),
    };
}

/**
 * Compute Saturday times from Zmanim.
 * Fallback display when Hebcal havdalah events are missing.
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
        sundownSaturday: formatTime12h(sunset),
        shabbatEnds: formatTime12h(ends),
    };
}

/**
 * Extract signals we need from Hebcal events:
 * - Candle lighting (Fri + Sat if Shabbat flows into Yom Tov)
 * - Havdalah
 * - Parsha
 * - Holiday-on-Shabbat detection even when location is OFF
 */
function getShabbatInfo(events, friday, saturday) {
    const shabbatInfo = {
        endsIntoYomTov: false,
        yomTovCandleTime: null,
        parshaReplacedByHoliday: false,
    };

    const fridayCandleEvents = [];
    const saturdayCandleEvents = [];
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

        // Holiday / CH"M on Shabbat day (works even w/out location)
        if (!foundHolidayOnSaturday && event instanceof Event) {
            const d =
                typeof event.getDate === "function" ? event.getDate() : null;
            const g = d && typeof d.greg === "function" ? d.greg() : null;

            if (g instanceof Date && isSameLocalDate(g, saturday)) {
                const cats =
                    typeof event.getCategories === "function"
                        ? event.getCategories()
                        : [];
                if (cats.includes("major") || cats.includes("chol_hamoed")) {
                    foundHolidayOnSaturday = true;
                }
            }
        }
    }

    shabbatInfo.endsIntoYomTov = saturdayCandleEvents.length > 0;
    shabbatInfo.parshaReplacedByHoliday =
        !shabbatInfo.parshaEnglish && foundHolidayOnSaturday;

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
    const [loading, setLoading] = useState(true);
    const [shabbatInfo, setShabbatInfo] = useState(null);
    const [showLocationDetails, setShowLocationDetails] = useState(false);

    const { candleLightingTime, havdalahTime } = useSelector(
        (state) => state.settings
    );

    const timezone = useMemo(
        () => Intl.DateTimeFormat().resolvedOptions().timeZone,
        []
    );

    // Centralized local “today”, auto-updates at midnight.
    const todayIso = useTodayIso({ debugIso: TEST_TODAY_ISO });

    // location comes from the shared hook
    const { status: locationStatus, location } = useAppLocation();
    const hasLocation = !!location && locationStatus === "granted";
    const openSettings = useCallback(() => {
        Linking.openSettings().catch(() =>
            Alert.alert("Unable to open settings")
        );
    }, []);

    const fetchShabbatInfo = useCallback(async () => {
        try {
            setLoading(true);

            const today = parseLocalIso(todayIso);

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

            const erevShabbatDate = formatGregorianLong(friday);
            const yomShabbatDate = formatGregorianLong(saturday);

            const erevShabbatHebrewDate = new HDate(friday).toString();
            const yomShabbatHebrewDate = new HDate(saturday).toString();

            // Include Saturday night (use Sunday 00:00 local)
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
    }, [todayIso, location, timezone, havdalahTime, candleLightingTime]);

    // ✅ Single source of truth for data fetching (no duplication):
    // Recompute whenever todayIso changes (midnight), settings change, or location changes.
    useEffect(() => {
        fetchShabbatInfo();
    }, [fetchShabbatInfo]);

    if (!fontsLoaded) return null;

    return (
        <SafeAreaView style={ui.shabbatContainer}>
            <ScrollView style={ui.screen}>
                {shabbatInfo ? (
                    <>
                        {/* Erev Shabbat */}
                        <View style={ui.card}>
                            <Text style={ui.cardTitle}>Erev Shabbat</Text>

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

                        {/* Yom Shabbat */}
                        <View style={ui.card}>
                            <Text style={ui.cardTitle}>Yom Shabbat</Text>

                            <Text style={ui.shabbatSentence}>
                                {shabbatInfo.yomShabbatDate}
                            </Text>

                            {shabbatInfo.shabbatEnds &&
                            !shabbatInfo.endsIntoYomTov ? (
                                <Text style={ui.shabbatSentence}>
                                    Havdalah at{" "}
                                    <Text style={ui.shabbatHighlight}>
                                        {shabbatInfo.shabbatEnds}
                                    </Text>
                                </Text>
                            ) : null}

                            {shabbatInfo.endsIntoYomTov ? (
                                shabbatInfo.yomTovCandleTime ? (
                                    <Text style={ui.shabbatSentence}>
                                        Holiday candle lighting at{" "}
                                        <Text style={ui.shabbatHighlight}>
                                            {shabbatInfo.yomTovCandleTime}
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
                                )
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

                        {/* Parasha */}
                        <View style={ui.card}>
                            {shabbatInfo.endsIntoYomTov ||
                            shabbatInfo.parshaReplacedByHoliday ? (
                                <Text style={ui.shabbatSentenceSmall}>
                                    Because a holiday begins Saturday evening,
                                    holiday candle lighting replaces Havdalah
                                    and the holiday Torah reading replaces the
                                    Parasha.
                                </Text>
                            ) : shabbatInfo.parshaEnglish ? (
                                <>
                                    <Text style={ui.cardTitle}>Parasha</Text>
                                    <Text style={ui.shabbatSentence}>
                                        {shabbatInfo.parshaEnglish}
                                    </Text>
                                    {shabbatInfo.parshaHebrew ? (
                                        <Text style={ui.shabbatSentence}>
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

                <BottomSheetDrawer
                    visible={showLocationDetails}
                    onClose={() => setShowLocationDetails(false)}
                    title="Your Location"
                    snapPoints={["30%", "45%"]}
                >
                    <View style={ui.shabbatSheetLine}>
                        <Text style={ui.shabbatSheetLabel}>Timezone</Text>
                        <Text style={ui.shabbatSheetValue}>
                            {timezone.replace(/_/g, " ")}
                        </Text>
                    </View>

                    <View style={ui.shabbatSheetLine}>
                        <Text style={ui.shabbatSheetLabel}>Coordinates</Text>
                        <Text style={ui.shabbatSheetValue}>
                            {hasLocation
                                ? `${location.latitude.toFixed(
                                      3
                                  )}, ${location.longitude.toFixed(3)}`
                                : "Unavailable"}
                        </Text>
                    </View>

                    <View style={ui.shabbatSheetLine}>
                        <Text style={ui.shabbatSheetLabel}>Elevation</Text>
                        <Text style={ui.shabbatSheetValue}>
                            {hasLocation && Number.isFinite(location.elevation)
                                ? `${location.elevation.toFixed(1)} meters`
                                : "Unknown"}
                        </Text>
                    </View>
                </BottomSheetDrawer>

                <View style={ui.shabbatFooter}>
                    {!hasLocation ? (
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
                    ) : null}
                </View>
            </ScrollView>

            {hasLocation ? (
                <Pressable
                    onPress={() => setShowLocationDetails(true)}
                    style={ui.shabbatLocationChip}
                    hitSlop={12}
                >
                    <View style={ui.shabbatGreenDot} />
                    <Text style={ui.shabbatLocationChipText}>Location</Text>
                </Pressable>
            ) : null}
        </SafeAreaView>
    );
}
