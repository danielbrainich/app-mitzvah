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
    Event, // used to detect holiday on Shabbat even without location
} from "@hebcal/core";
import { useFonts } from "expo-font";
import { useSelector } from "react-redux";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";

import useAppLocation from "../../hooks/useAppLocation";
import useTodayIsoDay from "../../hooks/useTodayIsoDay";
import { ui } from "../../styles/theme";
import LocationBottomSheet from "../LocationBottomSheet";

import {
    parseLocalIso,
    formatTime12h,
    formatGregorianLong,
    isSameLocalDate,
    addMinutes,
} from "../../utils/datetime";
import { DEBUG_TODAY_ISO } from "../../utils/debug";

/**
 * Helpers
 */
function getUpcomingFridayAndSaturday(today) {
    const friday = new Date(today);
    const saturday = new Date(today);

    if (today.getDay() === 6) {
        // Today is Saturday: show current Shabbat (Fri/Sat)
        friday.setDate(today.getDate() - 1);
        saturday.setDate(today.getDate());
    } else {
        // Upcoming Shabbat
        friday.setDate(today.getDate() + (5 - today.getDay()));
        saturday.setTime(friday.getTime());
        saturday.setDate(friday.getDate() + 1);
    }

    return { friday, saturday };
}

function makeHebcalLocation(location, timezone) {
    if (!location) return null;

    const elevation = Number.isFinite(location.elevation)
        ? location.elevation
        : undefined;

    return new Location(
        location.latitude,
        location.longitude,
        false,
        timezone,
        undefined,
        "US",
        undefined,
        elevation
    );
}

// ✅ Consistent minute rounding: one source of truth, one rounding rule
function floorToMinute(d) {
    if (!(d instanceof Date)) return null;
    const x = new Date(d);
    x.setSeconds(0, 0);
    return x;
}

function computeSundownFromZmanim({ location, timezone, date }) {
    if (!location) return null;
    const hebcalLocation = makeHebcalLocation(location, timezone);
    if (!hebcalLocation) return null;

    const zmanim = new Zmanim(hebcalLocation, date);
    const sunsetRaw = zmanim.sunset();
    if (!(sunsetRaw instanceof Date)) return null;

    // ✅ Use the same rounded sunset everywhere (prevents “off by 1–2 mins” confusion)
    return floorToMinute(sunsetRaw);
}

/**
 * Extract:
 * - Friday candle lighting time (Hebcal CandleLightingEvent)
 * - Saturday "Shabbat ends" time (Hebcal HavdalahEvent if present)
 * - Whether a holiday/CH"M is on Saturday (for parsha replacement message)
 * - Whether Shabbat ends into Yom Tov (Saturday CandleLightingEvent exists)
 */
function extractShabbatSignals({ events, friday, saturday }) {
    let fridayCandleTime = null;
    let saturdayCandleTime = null; // indicates Yom Tov candle lighting Saturday night
    let havdalahTime = null;

    let parshaEnglish = null;
    let parshaHebrew = null;

    let holidayOnSaturday = false;

    for (const ev of events || []) {
        // Candle lighting events (timed)
        if (ev instanceof CandleLightingEvent) {
            if (!(ev.eventTime instanceof Date)) continue;

            if (isSameLocalDate(ev.eventTime, friday)) {
                // Choose the first Friday candle lighting (usually correct)
                if (!fridayCandleTime) fridayCandleTime = ev.eventTime;
                continue;
            }

            if (isSameLocalDate(ev.eventTime, saturday)) {
                // Candle lighting on Saturday night -> Shabbat into Yom Tov
                if (!saturdayCandleTime) saturdayCandleTime = ev.eventTime;
                continue;
            }
        }

        // Havdalah event (timed) - may be absent when Yom Tov begins
        if (ev instanceof HavdalahEvent) {
            if (!(ev.eventTime instanceof Date)) continue;
            if (!isSameLocalDate(ev.eventTime, saturday)) continue;
            havdalahTime = ev.eventTime;
            continue;
        }

        // Parsha
        if (ev instanceof ParshaEvent) {
            parshaEnglish = ev.render("en");
            parshaHebrew = ev.renderBrief("he-x-NoNikud");
            continue;
        }

        // Holiday detection on Saturday (works even without location)
        if (!holidayOnSaturday && ev instanceof Event) {
            const d = typeof ev.getDate === "function" ? ev.getDate() : null;
            const g = d && typeof d.greg === "function" ? d.greg() : null;

            if (g instanceof Date && isSameLocalDate(g, saturday)) {
                const cats =
                    typeof ev.getCategories === "function"
                        ? ev.getCategories()
                        : [];
                if (cats.includes("major") || cats.includes("chol_hamoed")) {
                    holidayOnSaturday = true;
                }
            }
        }
    }

    const endsIntoYomTov = !!saturdayCandleTime;

    // If there’s a holiday on Saturday, Parsha may be replaced.
    // This is more reliable than “parsha missing => replaced” by itself.
    const parshaReplacedByHoliday =
        holidayOnSaturday && (!parshaEnglish || !parshaHebrew);

    return {
        fridayCandleTime,
        havdalahTime,
        endsIntoYomTov,
        parshaEnglish,
        parshaHebrew,
        parshaReplacedByHoliday,
    };
}

export default function Shabbat() {
    const [fontsLoaded] = useFonts({
        ChutzBold: require("../../assets/fonts/Chutz-Bold.otf"),
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

    const tabBarHeight = useBottomTabBarHeight();
    const todayIso = useTodayIsoDay(DEBUG_TODAY_ISO);

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
            if (!today) return;

            const { friday, saturday } = getUpcomingFridayAndSaturday(today);

            const erevShabbatDate = formatGregorianLong(friday);
            const yomShabbatDate = formatGregorianLong(saturday);

            const erevShabbatHebrewDate = new HDate(friday).toString();
            const yomShabbatHebrewDate = new HDate(saturday).toString();

            // Range end: include Saturday night
            const end = new Date(saturday);
            end.setDate(end.getDate() + 1);
            end.setHours(0, 0, 0, 0);

            const hebcalLocation = hasLocation
                ? makeHebcalLocation(location, timezone)
                : null;

            // IMPORTANT: Use your user settings here (not 1 minute)
            const candleMins = Number.isFinite(candleLightingTime)
                ? candleLightingTime
                : 18;

            const havdalahMins = Number.isFinite(havdalahTime)
                ? havdalahTime
                : 42;

            const events = HebrewCalendar.calendar({
                start: friday,
                end,
                sedrot: true,

                // Only request timed candle/havdalah if location is available
                ...(hebcalLocation
                    ? {
                          location: hebcalLocation,
                          candlelighting: true,
                          candleLightingMins: candleMins,
                          havdalahMins,
                      }
                    : {}),
            });

            const signals = extractShabbatSignals({ events, friday, saturday });

            // Sundown (single source of truth) — only possible with location anyway
            const fridaySunset = hasLocation
                ? computeSundownFromZmanim({ location, timezone, date: friday })
                : null;

            const saturdaySunset = hasLocation
                ? computeSundownFromZmanim({
                      location,
                      timezone,
                      date: saturday,
                  })
                : null;

            // ✅ LOGIC CHANGE (only): derive candle + ends from *the same* sunset values
            // This guarantees your “X minutes before/after sundown” setting is always consistent.
            const candleTimeStr = fridaySunset
                ? formatTime12h(addMinutes(fridaySunset, -candleMins))
                : null;

            const shabbatEndsStr = saturdaySunset
                ? formatTime12h(addMinutes(saturdaySunset, havdalahMins))
                : null;

            setShabbatInfo({
                erevShabbatDate,
                erevShabbatHebrewDate,
                yomShabbatDate,
                yomShabbatHebrewDate,

                candleTime: candleTimeStr,
                sundownFriday: fridaySunset
                    ? formatTime12h(fridaySunset)
                    : null,

                shabbatEnds: shabbatEndsStr,
                sundownSaturday: saturdaySunset
                    ? formatTime12h(saturdaySunset)
                    : null,

                endsIntoYomTov: signals.endsIntoYomTov,

                parshaEnglish: signals.parshaEnglish,
                parshaHebrew: signals.parshaHebrew,
                parshaReplacedByHoliday: signals.parshaReplacedByHoliday,

                todayIso,
            });
        } catch (error) {
            console.error("[Shabbat] Error fetching Shabbat info:", error);
        } finally {
            setLoading(false);
        }
    }, [
        todayIso,
        hasLocation,
        location,
        timezone,
        candleLightingTime,
        havdalahTime,
    ]);

    useEffect(() => {
        fetchShabbatInfo();
    }, [fetchShabbatInfo]);

    if (!fontsLoaded) return null;

    return (
        <View style={ui.container}>
            <ScrollView
                style={ui.screen}
                contentContainerStyle={[
                    ui.scrollContent,
                    { paddingBottom: tabBarHeight + 16 },
                ]}
                showsVerticalScrollIndicator={false}
            >
                {shabbatInfo ? (
                    <>
                        {/* Erev Shabbat */}
                        <View style={ui.card}>
                            <Text
                                style={[
                                    ui.cardTitle,
                                    { fontFamily: "ChutzBold" },
                                ]}
                            >
                                Erev Shabbat
                            </Text>

                            <Text style={ui.shabbatSentence}>
                                {shabbatInfo.erevShabbatDate}
                            </Text>

                            {shabbatInfo.candleTime && (
                                <View style={ui.shabbatSheetLine}>
                                    <Text style={ui.shabbatSheetLabel}>
                                        Candle lighting
                                    </Text>
                                    <Text style={ui.shabbatSheetValue}>
                                        {shabbatInfo.candleTime}
                                    </Text>
                                </View>
                            )}

                            {shabbatInfo.sundownFriday && (
                                <View style={ui.shabbatSheetLine}>
                                    <Text style={ui.shabbatSheetLabel}>
                                        Sundown
                                    </Text>
                                    <Text style={ui.shabbatSheetValue}>
                                        {shabbatInfo.sundownFriday}
                                    </Text>
                                </View>
                            )}

                            {!hasLocation ? (
                                <Text
                                    style={[
                                        ui.shabbatSentenceSmall,
                                        ui.shabbatMuted,
                                    ]}
                                >
                                    Turn on location services to see times for
                                    your area.
                                </Text>
                            ) : null}
                        </View>

                        {/* Yom Shabbat */}
                        <View style={ui.card}>
                            <Text
                                style={[
                                    ui.cardTitle,
                                    { fontFamily: "ChutzBold" },
                                ]}
                            >
                                Yom Shabbat
                            </Text>

                            <Text style={ui.shabbatSentence}>
                                {shabbatInfo.yomShabbatDate}
                            </Text>

                            {shabbatInfo.shabbatEnds && (
                                <View style={ui.shabbatSheetLine}>
                                    <Text style={ui.shabbatSheetLabel}>
                                        Shabbat ends
                                    </Text>
                                    <Text style={ui.shabbatSheetValue}>
                                        {shabbatInfo.shabbatEnds}
                                    </Text>
                                </View>
                            )}
                            {shabbatInfo.sundownSaturday && (
                                <View style={ui.shabbatSheetLine}>
                                    <Text style={ui.shabbatSheetLabel}>
                                        Sundown
                                    </Text>
                                    <Text style={ui.shabbatSheetValue}>
                                        {shabbatInfo.sundownSaturday}
                                    </Text>
                                </View>
                            )}
                        </View>

                        {/* Parasha */}
                        <View style={ui.card}>
                            <Text
                                style={[
                                    ui.cardTitle,
                                    { fontFamily: "ChutzBold" },
                                ]}
                            >
                                Parasha
                            </Text>

                            {shabbatInfo.parshaEnglish &&
                            !shabbatInfo.parshaReplacedByHoliday ? (
                                <View style={ui.shabbatSheetLine}>
                                    <Text style={ui.shabbatSheetLabel}>
                                        {shabbatInfo.parshaEnglish}
                                    </Text>
                                    {shabbatInfo.parshaHebrew ? (
                                        <Text style={ui.shabbatSheetValue}>
                                            {shabbatInfo.parshaHebrew}
                                        </Text>
                                    ) : null}
                                </View>
                            ) : (
                                <Text style={ui.shabbatSentenceSmall}>
                                    This week’s holiday Torah reading replaces
                                    the parasha.
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

                {/* Location bottom sheet */}
                <LocationBottomSheet
                    visible={showLocationDetails}
                    onClose={() => setShowLocationDetails(false)}
                    title="Your Location"
                    snapPoints={["35%", "65%"]}
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
                </LocationBottomSheet>

                {/* Footer notice / chip */}
                <View style={ui.shabbatFooter}>
                    {!hasLocation ? (
                        <View style={ui.shabbatLocationNotice}>
                            <Text style={ui.shabbatLocationNoticeTitle}>
                                Location is off
                            </Text>
                            <Text style={ui.shabbatLocationNoticeBody}>
                                Candle lighting, sundown, and end times use your
                                device’s location. Turn on location services to
                                see those times.
                            </Text>

                            <TouchableOpacity
                                onPress={() => {
                                    openSettings();
                                    Haptics.impactAsync(
                                        Haptics.ImpactFeedbackStyle.Light
                                    );
                                }}
                                style={ui.shabbatCta}
                            >
                                <Text style={ui.shabbatCtaText}>
                                    Open Settings
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={{ marginTop: 10 }}>
                            <Pressable
                                onPress={() => {
                                    setShowLocationDetails(true);
                                    Haptics.impactAsync(
                                        Haptics.ImpactFeedbackStyle.Light
                                    );
                                }}
                                style={[
                                    ui.shabbatLocationChip,
                                    ui.shabbatLocationChipInline,
                                ]}
                                hitSlop={12}
                            >
                                <View style={ui.shabbatGreenDot} />
                                <Text style={ui.shabbatLocationChipText}>
                                    Location
                                </Text>
                            </Pressable>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
