import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import {
    View,
    Text,
    Linking,
    TouchableOpacity,
    Alert,
    Pressable,
    ScrollView,
} from "react-native";
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
} from "../../utils/datetime";

import { computeShabbatInfo } from "../../lib/computeShabbatInfo";

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

    const todayIso = useTodayIsoDay();

    const {
        status: locationStatus,
        location,
        requestPermission,
    } = useAppLocation();
    const hasLocation = locationStatus === "granted" && !!location;

    // Primitives to avoid dependency loops on object identity
    const lat = location?.latitude ?? null;
    const lon = location?.longitude ?? null;
    const elev = location?.elevation ?? null;

    const candleMins = Number.isFinite(candleLightingTime)
        ? candleLightingTime
        : 18;
    const havdalahMins = Number.isFinite(havdalahTime) ? havdalahTime : 42;

    const openSettings = useCallback(() => {
        Linking.openSettings().catch(() =>
            Alert.alert("Unable to open settings")
        );
    }, []);

    // Guard against setting state after unmount
    const aliveRef = useRef(true);
    useEffect(() => {
        aliveRef.current = true;
        return () => {
            aliveRef.current = false;
        };
    }, []);

    const fetchShabbatInfo = useCallback(async () => {
        try {
            setLoading(true);

            const today = parseLocalIso(todayIso);
            if (!today) return;

            const result = computeShabbatInfo({
                today,
                todayIso,
                timezone,
                location: hasLocation
                    ? { latitude: lat, longitude: lon, elevation: elev }
                    : null,
                candleMins,
                havdalahMins,
            });

            if (aliveRef.current) setShabbatInfo(result);
        } catch (e) {
            console.error("[Shabbat] Error fetching Shabbat info:", e);
        } finally {
            if (aliveRef.current) setLoading(false);
        }
    }, [
        todayIso,
        timezone,
        hasLocation,
        lat,
        lon,
        elev,
        candleMins,
        havdalahMins,
    ]);

    // Recompute when:
    // - location permission changes
    // - lat/lon/elev changes
    // - user settings for mins change
    // - day changes
    useEffect(() => {
        fetchShabbatInfo();
    }, [
        fetchShabbatInfo,
        locationStatus,
        lat,
        lon,
        elev,
        candleMins,
        havdalahMins,
    ]);

    const handleEnableLocation = useCallback(async () => {
        const st = await requestPermission();

        if (st !== "granted") {
            // If user chose "Don't Allow" permanently, send to settings.
            openSettings();
            return;
        }

        setShowLocationDetails(false);
    }, [requestPermission, openSettings]);

    if (!fontsLoaded) return null;

    const MAX_WIDTH = 520;
    const tabBarHeight = useBottomTabBarHeight();

    const dash = "—";

    const candleValue = shabbatInfo?.candleTime
        ? formatTime12h(shabbatInfo.candleTime)
        : dash;

    const friSundownValue = shabbatInfo?.fridaySunset
        ? formatTime12h(shabbatInfo.fridaySunset)
        : dash;

    const endsValue = shabbatInfo?.shabbatEnds
        ? formatTime12h(shabbatInfo.shabbatEnds)
        : dash;

    const satSundownValue = shabbatInfo?.saturdaySunset
        ? formatTime12h(shabbatInfo.saturdaySunset)
        : dash;

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
                                    {formatGregorianLong(shabbatInfo.friday)}
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
                                    {formatGregorianLong(shabbatInfo.saturday)}
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

                    {/* Footer chip */}
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
                                    {Number.isFinite(elev)
                                        ? `${elev.toFixed(1)} meters`
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

                            {/* Smaller "More Info" style button */}
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
                                <Text style={ui.todayHolidayMoreInfoButtonText}>
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
