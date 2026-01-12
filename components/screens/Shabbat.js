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
    Event,
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
        // Saturday: show current Shabbat (Fri/Sat)
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

// ✅ FIXED: returns the rounded date (you had `return;`)
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

    return floorToMinute(sunsetRaw);
}

function extractShabbatSignals({ events, friday, saturday }) {
    let fridayCandleTime = null;
    let saturdayCandleTime = null;
    let havdalahTime = null;

    let parshaEnglish = null;
    let parshaHebrew = null;

    let holidayOnSaturday = false;

    for (const ev of events || []) {
        if (ev instanceof CandleLightingEvent) {
            if (!(ev.eventTime instanceof Date)) continue;

            if (isSameLocalDate(ev.eventTime, friday)) {
                if (!fridayCandleTime) fridayCandleTime = ev.eventTime;
                continue;
            }

            if (isSameLocalDate(ev.eventTime, saturday)) {
                if (!saturdayCandleTime) saturdayCandleTime = ev.eventTime;
                continue;
            }
        }

        if (ev instanceof HavdalahEvent) {
            if (!(ev.eventTime instanceof Date)) continue;
            if (!isSameLocalDate(ev.eventTime, saturday)) continue;
            havdalahTime = ev.eventTime;
            continue;
        }

        if (ev instanceof ParshaEvent) {
            parshaEnglish = ev.render("en");
            parshaHebrew = ev.renderBrief("he-x-NoNikud");
            continue;
        }

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
    } = useAppLocation();

    // ✅ stable primitives so we don't depend on location object identity
    const lat = location?.latitude ?? null;
    const lon = location?.longitude ?? null;
    const elevation = location?.elevation ?? null;

    const hasLocation =
        lat != null && lon != null && locationStatus === "granted";

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

            const locObj = hasLocation
                ? { latitude: lat, longitude: lon, elevation }
                : null;

            const hebcalLocation = locObj
                ? makeHebcalLocation(locObj, timezone)
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
                ? computeSundownFromZmanim({
                      location: locObj,
                      timezone,
                      date: friday,
                  })
                : null;

            const saturdaySunset = hasLocation
                ? computeSundownFromZmanim({
                      location: locObj,
                      timezone,
                      date: saturday,
                  })
                : null;

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
        timezone,
        hasLocation,
        lat,
        lon,
        elevation,
        candleLightingTime,
        havdalahTime,
    ]);

    // ✅ This runs:
    // - on first mount
    // - when redux settings change
    // - when AppState refresh updates locationStatus/lat/lon
    useEffect(() => {
        fetchShabbatInfo();
    }, [fetchShabbatInfo]);

    if (!fontsLoaded) return null;

    const MAX_WIDTH = 520;
    const tabBarHeight = useBottomTabBarHeight();

    const dash = "—";
    const candleValue = shabbatInfo?.candleTime ?? dash;
    const friSundownValue = shabbatInfo?.sundownFriday ?? dash;
    const endsValue = shabbatInfo?.shabbatEnds ?? dash;
    const satSundownValue = shabbatInfo?.sundownSaturday ?? dash;

    const handleEnableLocation = useCallback(async () => {
        const st = await requestPermission?.();

        // If user previously denied, iOS often won't show the prompt again.
        // In that case, send them to Settings.
        if (st !== "granted") {
            openSettings();
            return;
        }

        setShowLocationDetails(false);
        // no need to call refresh here; requestPermission already set location
    }, [requestPermission, openSettings]);

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
                <View style={{ width: "100%", maxWidth: MAX_WIDTH }}>
                    {shabbatInfo ? (
                        <>
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

                <LocationBottomSheet
                    visible={showLocationDetails}
                    onClose={() => setShowLocationDetails(false)}
                    title="Location"
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
                                    {`${lat.toFixed(3)}, ${lon.toFixed(3)}`}
                                </Text>
                            </View>

                            <View style={ui.shabbatSheetLine}>
                                <Text style={ui.shabbatSheetLabel}>
                                    Elevation
                                </Text>
                                <Text style={ui.shabbatSheetValue}>
                                    {Number.isFinite(elevation)
                                        ? `${elevation.toFixed(1)} meters`
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
                                style={[
                                    ui.todayHolidayMoreInfoButton,
                                    {
                                        paddingVertical: 8,
                                        paddingHorizontal: 12,
                                        borderRadius: 12,
                                        alignSelf: "flex-start",
                                        marginTop: 6,
                                    },
                                ]}
                                activeOpacity={0.85}
                            >
                                <Text
                                    style={[
                                        ui.todayHolidayMoreInfoButtonText,
                                    ]}
                                >
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
