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
import { Entypo } from "@expo/vector-icons";

import useAppLocation from "../../hooks/useAppLocation";
import useTodayIsoDay from "../../hooks/useTodayIsoDay";
import { ui, colors } from "../../styles/theme";
import LocationBottomSheet from "../LocationBottomSheet";

import { parseLocalIso, formatTime12h } from "../../utils/datetime";
import {
    computeShabbatInfo,
    buildShabbatViewModel,
} from "../../lib/computeShabbatInfo";

function RowLine({ label, value }) {
    return (
        <View style={ui.shabbatSheetLine}>
            <Text style={ui.shabbatSheetLabel}>{label}</Text>
            <Text style={ui.shabbatSheetValue}>{value}</Text>
        </View>
    );
}

export default function Shabbat() {
    const [fontsLoaded] = useFonts({
        ChutzBold: require("../../assets/fonts/Chutz-Bold.otf"),
    });

    const [loading, setLoading] = useState(true);
    const [shabbatInfo, setShabbatInfo] = useState(null);
    const [showLocationDetails, setShowLocationDetails] = useState(false);

    // Date toggles (UI-only)
    const [showHebrewFri, setShowHebrewFri] = useState(false);
    const [showHebrewSat, setShowHebrewSat] = useState(false);
    const [showParshaHeb, setShowParshaHeb] = useState(false);

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
            openSettings();
            return;
        }
        setShowLocationDetails(false);
    }, [requestPermission, openSettings]);

    // Countdown ticker (UI-only)
    const [now, setNow] = useState(() => new Date());
    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    const tabBarHeight = useBottomTabBarHeight();
    const MAX_WIDTH = 520;
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

    const canShowParsha =
        !!shabbatInfo?.parshaEnglish &&
        !!shabbatInfo?.parshaHebrew &&
        !shabbatInfo?.parshaReplacedByHoliday;

    // One computed view model from module
    const vm = useMemo(
        () => buildShabbatViewModel(shabbatInfo, now),
        [shabbatInfo, now]
    );

    if (!fontsLoaded) return null;

    return (
        <View style={ui.safeArea}>
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
                    {/* HERO */}
                    <View style={ui.shabbatHeroWrap}>
                        <Text style={ui.shabbatHeroTitle}>{vm.hero.title}</Text>

                        {!vm.status.isDuring ? (
                            <>
                                <Text
                                    style={[ui.shabbatHeroMonth, ui.textChutz]}
                                    numberOfLines={1}
                                >
                                    {vm.range.monthLine}
                                </Text>
                                <Text
                                    style={[ui.shabbatHeroDays, ui.textChutz]}
                                    numberOfLines={1}
                                >
                                    {vm.range.dayLine}
                                </Text>
                            </>
                        ) : (
                            <Text style={[ui.shabbatHeroSub, ui.textChutz]}>
                                Shabbat ends at {endsValue}
                            </Text>
                        )}
                    </View>

                    {/* COUNTDOWN CARD */}
                    {vm.countdown.show ? (
                        <View style={ui.shabbatCountdownCard}>
                            <View style={ui.shabbatCountdownItem}>
                                <Text style={ui.shabbatCountdownNumber}>
                                    {vm.countdown.parts.days}
                                </Text>
                                <Text style={ui.shabbatCountdownLabel}>
                                    Days
                                </Text>
                            </View>
                            <View style={ui.shabbatCountdownItem}>
                                <Text style={ui.shabbatCountdownNumber}>
                                    {vm.countdown.parts.hours}
                                </Text>
                                <Text style={ui.shabbatCountdownLabel}>
                                    Hours
                                </Text>
                            </View>
                            <View style={ui.shabbatCountdownItem}>
                                <Text style={ui.shabbatCountdownNumber}>
                                    {vm.countdown.parts.mins}
                                </Text>
                                <Text style={ui.shabbatCountdownLabel}>
                                    Minutes
                                </Text>
                            </View>
                            <View style={ui.shabbatCountdownItem}>
                                <Text style={ui.shabbatCountdownNumber}>
                                    {vm.countdown.parts.secs}
                                </Text>
                                <Text style={ui.shabbatCountdownLabel}>
                                    Seconds
                                </Text>
                            </View>
                        </View>
                    ) : null}

                    {/* DETAILS CARD */}
                    {shabbatInfo ? (
                        <View style={ui.card}>
                            {/* Friday header row (date is tappable toggle) */}
                            <View style={ui.shabbatSectionHeaderRow}>
                                <Text style={ui.shabbatSectionHeaderLeft}>
                                    Friday
                                </Text>

                                <Pressable
                                    onPress={() => {
                                        Haptics.impactAsync(
                                            Haptics.ImpactFeedbackStyle.Light
                                        );
                                        setShowHebrewFri((v) => !v);
                                    }}
                                    hitSlop={12}
                                    style={ui.shabbatSectionHeaderDatePressable}
                                >
                                    <View
                                        style={ui.shabbatSectionHeaderDateRow}
                                    >
                                        <Entypo
                                            name="cycle"
                                            size={13}
                                            color={colors.muted}
                                        />
                                        <Text
                                            style={ui.shabbatSectionHeaderRight}
                                            numberOfLines={1}
                                        >
                                            {showHebrewFri
                                                ? shabbatInfo.erevShabbatHebrewDate
                                                : shabbatInfo.erevShabbatGregDate}
                                        </Text>
                                    </View>
                                </Pressable>
                            </View>

                            <RowLine
                                label="Candle lighting"
                                value={candleValue}
                            />
                            <RowLine label="Sundown" value={friSundownValue} />

                            <View style={ui.settingsDivider} />

                            {/* Saturday header row (date is tappable toggle) */}
                            <View style={ui.shabbatSectionHeaderRow}>
                                <Text style={ui.shabbatSectionHeaderLeft}>
                                    Saturday
                                </Text>

                                <Pressable
                                    onPress={() => {
                                        Haptics.impactAsync(
                                            Haptics.ImpactFeedbackStyle.Light
                                        );
                                        setShowHebrewSat((v) => !v);
                                    }}
                                    hitSlop={12}
                                    style={ui.shabbatSectionHeaderDatePressable}
                                >
                                    <View
                                        style={ui.shabbatSectionHeaderDateRow}
                                    >
                                        <Entypo
                                            name="cycle"
                                            size={13}
                                            color={colors.muted}
                                        />
                                        <Text
                                            style={ui.shabbatSectionHeaderRight}
                                            numberOfLines={1}
                                        >
                                            {showHebrewSat
                                                ? shabbatInfo.yomShabbatHebrewDate
                                                : shabbatInfo.yomShabbatGregDate}
                                        </Text>
                                    </View>
                                </Pressable>
                            </View>

                            <RowLine label="Sundown" value={satSundownValue} />
                            <RowLine label="Shabbat ends" value={endsValue} />

                            <View style={ui.settingsDivider} />

                            {/* Parasha */}
                            {canShowParsha ? (
                                <View
                                    style={{
                                        flexDirection: "row",
                                        flexWrap: "wrap",
                                        alignItems: "center",
                                    }}
                                >
                                    <Text style={ui.shabbatSentenceSmall}>
                                        This week’s parasha is{" "}
                                    </Text>

                                    <Pressable
                                        onPress={() => {
                                            Haptics.impactAsync(
                                                Haptics.ImpactFeedbackStyle
                                                    .Light
                                            );
                                            setShowParshaHeb((v) => !v);
                                        }}
                                        hitSlop={12}
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            gap: 6,
                                        }}
                                    >

                                        <Entypo
                                            name="cycle"
                                            size={13}
                                            color={colors.muted}
                                        />
                                        <Text
                                            style={[
                                                ui.shabbatParshaSmall,
                                                showParshaHeb &&
                                                ui.shabbatParshaHebrew,
                                            ]}
                                        >
                                            {showParshaHeb
                                                ? shabbatInfo.parshaHebrew
                                                : shabbatInfo.parshaEnglish}
                                        </Text>
                                    </Pressable>
                                </View>
                            ) : (
                                <Text style={ui.shabbatSentenceSmall}>
                                    This week’s holiday Torah reading replaces
                                    the parasha.
                                </Text>
                            )}
                        </View>
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
