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
import { useFocusEffect } from "@react-navigation/native";
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

    const todayIso = useTodayIsoDay(DEBUG_TODAY_ISO);

    const {
        status: locationStatus,
        location,
        requestPermission,
        refresh,
    } = useAppLocation();
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

            // ✅ derive candle + ends from *the same* sunset values
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

    const lat = location?.latitude ?? null;
    const lon = location?.longitude ?? null;

    useFocusEffect(
        useCallback(() => {
            let alive = true;

            (async () => {
                // 1) make sure permission/location state is current
                await refresh?.();

                // 2) recompute using latest redux settings + latest location
                if (alive) {
                    fetchShabbatInfo();
                }
            })();

            return () => {
                alive = false;
            };
        }, [refresh, fetchShabbatInfo])
    );

    // Live updates while *staying on* Shabbat
    useEffect(() => {
        fetchShabbatInfo();
    }, [fetchShabbatInfo, locationStatus, lat, lon]);

    if (!fontsLoaded) return null;

    // ✅ Layout constants for “centered block”
    const MAX_WIDTH = 520;
    const tabBarHeight = useBottomTabBarHeight();

    const dash = "—";
    const candleValue = shabbatInfo?.candleTime ?? dash;
    const friSundownValue = shabbatInfo?.sundownFriday ?? dash;
    const endsValue = shabbatInfo?.shabbatEnds ?? dash;
    const satSundownValue = shabbatInfo?.sundownSaturday ?? dash;

    const handleEnableLocation = useCallback(async () => {
        const st = await requestPermission?.();

        if (st === "granted") {
            setShowLocationDetails(false);
            await refresh?.();
            fetchShabbatInfo();
            return;
        }

        if (st === "denied") {
            openSettings();
        }
    }, [requestPermission, refresh, fetchShabbatInfo, openSettings]);

    return (
        <View style={ui.container}>
            <ScrollView
                style={ui.screen}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    ui.scrollContent,
                    {
                        flexGrow: 1,
                        paddingTop: 8,
                        paddingBottom: tabBarHeight + 18,
                    },
                ]}
            >
                {/* Inner fixed-width column */}
                <View
                    style={{
                        width: "100%",
                        maxWidth: MAX_WIDTH,
                    }}
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

                                {/* ✅ Always show rows; use dash for missing values */}
                                <View style={ui.shabbatSheetLine}>
                                    <Text style={ui.shabbatSheetLabel}>
                                        Candle lighting
                                    </Text>
                                    <Text style={ui.shabbatSheetValue}>
                                        {candleValue}
                                    </Text>
                                </View>

                                <View style={ui.shabbatSheetLine}>
                                    <Text style={ui.shabbatSheetLabel}>
                                        Sundown
                                    </Text>
                                    <Text style={ui.shabbatSheetValue}>
                                        {friSundownValue}
                                    </Text>
                                </View>
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

                                {/* ✅ Always show rows; use dash for missing values */}
                                <View style={ui.shabbatSheetLine}>
                                    <Text style={ui.shabbatSheetLabel}>
                                        Shabbat ends
                                    </Text>
                                    <Text style={ui.shabbatSheetValue}>
                                        {endsValue}
                                    </Text>
                                </View>

                                <View style={ui.shabbatSheetLine}>
                                    <Text style={ui.shabbatSheetLabel}>
                                        Sundown
                                    </Text>
                                    <Text style={ui.shabbatSheetValue}>
                                        {satSundownValue}
                                    </Text>
                                </View>
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
                                        This week’s holiday Torah reading
                                        replaces the parasha.
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

                    {/* Footer notice / chip (included in centered block) */}
                    <View style={ui.shabbatFooter}>
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
                                <View
                                    style={[
                                        ui.shabbatGreenDot,
                                        !hasLocation
                                            ? { backgroundColor: "#ff3b30" }
                                            : null,
                                    ]}
                                />
                                <Text style={ui.shabbatLocationChipText}>
                                    {hasLocation
                                        ? "Location on"
                                        : "Location off"}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>

                {/* Location bottom sheet */}
                <LocationBottomSheet
                    visible={showLocationDetails}
                    onClose={() => setShowLocationDetails(false)}
                    title="Your Location"
                    snapPoints={["35%", "65%"]}
                >
                    {hasLocation ? (
                        <>
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
                                    {`${location.latitude.toFixed(
                                        3
                                    )}, ${location.longitude.toFixed(3)}`}
                                </Text>
                            </View>

                            <View style={ui.shabbatSheetLine}>
                                <Text style={ui.shabbatSheetLabel}>
                                    Elevation
                                </Text>
                                <Text style={ui.shabbatSheetValue}>
                                    {Number.isFinite(location.elevation)
                                        ? `${location.elevation.toFixed(
                                              1
                                          )} meters`
                                        : "Unknown"}
                                </Text>
                            </View>
                        </>
                    ) : (
                        <>
                            <Text
                                style={[
                                    ui.shabbatSentenceSmall,
                                    { marginBottom: 12 },
                                ]}
                            >
                                To calculate candle lighting, sundown, and
                                Shabbat end times for your area, please enable
                                Location Services for this app.
                            </Text>

                            <TouchableOpacity
                                onPress={() => {
                                    handleEnableLocation();
                                    Haptics.impactAsync(
                                        Haptics.ImpactFeedbackStyle.Light
                                    );
                                }}
                                style={ui.shabbatCta}
                                activeOpacity={0.85}
                            >
                                <Text style={ui.shabbatCtaText}>
                                    Enable Location
                                </Text>
                            </TouchableOpacity>
                        </>
                    )}
                </LocationBottomSheet>
            </ScrollView>
        </View>
    );
}
