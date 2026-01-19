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

/** Small row for time lines */
function RowLine({ label, value }) {
    return (
        <View style={ui.shabbatSheetLine}>
            <Text style={ui.shabbatSheetLabel}>{label}</Text>
            <Text style={ui.shabbatSheetValue}>{value}</Text>
        </View>
    );
}

function formatIsoLocal(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

function localNoonFromIso(iso) {
    const d = parseLocalIso(iso);
    if (!d) return null;
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0, 0);
}

export default function Shabbat() {
    const [fontsLoaded] = useFonts({
        ChutzBold: require("../../assets/fonts/Chutz-Bold.otf"),
    });

    const [loading, setLoading] = useState(true);
    const [shabbatInfo, setShabbatInfo] = useState(null);
    const [showLocationDetails, setShowLocationDetails] = useState(false);

    // UI toggles
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

    // primitives (avoid object identity loops)
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

    const handleEnableLocation = useCallback(async () => {
        const st = await requestPermission();
        if (st !== "granted") {
            openSettings();
            return;
        }
        setShowLocationDetails(false);
    }, [requestPermission, openSettings]);

    // detect override (todayIso comes from hook; realIso is device date)
    const realIso = useMemo(() => formatIsoLocal(new Date()), []);
    const isDevOverride = todayIso !== realIso;

    /**
     * "now" behavior:
     * - normal: tick every second
     * - override: freeze now at local noon of override day (and do NOT tick)
     */
    const [now, setNow] = useState(() => new Date());
    useEffect(() => {
        if (isDevOverride) {
            const frozen = localNoonFromIso(todayIso) ?? new Date();
            setNow(frozen);
            return;
        }
        const t = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(t);
    }, [isDevOverride, todayIso]);

    // Guard against setting state after unmount
    const aliveRef = useRef(true);
    useEffect(() => {
        aliveRef.current = true;
        return () => {
            aliveRef.current = false;
        };
    }, []);

    // Compute Shabbat info (based on todayIso, which already supports override)
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
                now, // ✅ important for "Saturday after end => next Shabbat" + override freeze
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
        now,
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

    const tabBarHeight = useBottomTabBarHeight();
    const MAX_WIDTH = 520;
    const dash = "—";

    const candleValue = shabbatInfo?.candleTime
        ? formatTime12h(shabbatInfo.candleTime)
        : dash;
    const friSundownValue = shabbatInfo?.fridaySunset
        ? formatTime12h(shabbatInfo.fridaySunset)
        : dash;
    const satSundownValue = shabbatInfo?.saturdaySunset
        ? formatTime12h(shabbatInfo.saturdaySunset)
        : dash;
    const endsValue = shabbatInfo?.shabbatEnds
        ? formatTime12h(shabbatInfo.shabbatEnds)
        : dash;

    const canShowParsha =
        !!shabbatInfo?.parshaEnglish &&
        !!shabbatInfo?.parshaHebrew &&
        !shabbatInfo?.parshaReplacedByHoliday;

    // View model (countdown is frozen in override mode, but still visible)
    const vm = useMemo(() => {
        const base = buildShabbatViewModel(shabbatInfo, now, { isDevOverride });

        // You asked: override should freeze countdown, but NOT hide it.
        if (isDevOverride) {
            return {
                ...base,
                countdown: {
                    ...base.countdown,
                    show: true,
                    parts: base.countdown?.parts ?? {
                        days: "00",
                        hours: "00",
                        mins: "00",
                        secs: "00",
                    },
                },
            };
        }

        return base;
    }, [shabbatInfo, now, isDevOverride]);

    if (!fontsLoaded) return null;

    return (
        <View style={ui.safeArea}>
            <View
                style={[
                    ui.screen,
                    { flex: 1, paddingBottom: tabBarHeight + 10 },
                ]}
            >
                <View style={{ flex: 1, width: "100%", alignItems: "center" }}>
                    <View
                        style={{ flex: 1, width: "100%", maxWidth: MAX_WIDTH }}
                    >
                        {/* ===== TOP (Centered hero + countdown in remaining space) ===== */}
                        <View
                            style={{
                                flex: 1,
                                justifyContent: "center",
                                paddingTop: 8,
                            }}
                        >
                            {/* HERO */}
                            <View
                                style={[
                                    ui.shabbatHeroWrap,
                                    { paddingBottom: 8 },
                                ]}
                            >
                                <Text style={ui.shabbatHeroTitle}>
                                    {vm.status.isDuring
                                        ? "Shabbat Shalom"
                                        : "Shabbat this week begins"}
                                </Text>

                                {!vm.status.isDuring ? (
                                    <Text
                                        style={[
                                            ui.shabbatHeroDate,
                                            ui.textChutz,
                                        ]}
                                        numberOfLines={1}
                                    >
                                        {shabbatInfo?.erevShabbatShort ?? ""}
                                    </Text>
                                ) : (
                                    <Text
                                        style={[
                                            ui.shabbatHeroSub,
                                            ui.textChutz,
                                        ]}
                                    >
                                        Shabbat ends at {endsValue}
                                    </Text>
                                )}
                            </View>

                            {/* COUNTDOWN CARD (always shown if vm.countdown.show; override forces show=true) */}
                            {vm.countdown?.show ? (
                                <View
                                    style={[
                                        ui.shabbatCountdownCard,
                                        { marginBottom: 18 },
                                    ]}
                                >
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
                        </View>

                        {/* ===== BOTTOM STACK: Details card above chip, chip above nav ===== */}
                        <View style={{ width: "100%" }}>
                            {/* DETAILS CARD */}
                            {shabbatInfo ? (
                                <View style={[ui.card, { marginBottom: 10 }]}>
                                    {/* Friday header */}
                                    <View
                                        style={[
                                            ui.shabbatSectionHeaderRow,
                                            { marginVertical: 10 },
                                        ]}
                                    >
                                        <Text
                                            style={ui.shabbatSectionHeaderLeft}
                                        >
                                            Friday
                                        </Text>

                                        <Pressable
                                            onPress={() => {
                                                Haptics.impactAsync(
                                                    Haptics.ImpactFeedbackStyle
                                                        .Light
                                                );
                                                setShowHebrewFri((v) => !v);
                                            }}
                                            hitSlop={12}
                                            style={
                                                ui.shabbatSectionHeaderDatePressable
                                            }
                                        >
                                            <View
                                                style={
                                                    ui.shabbatSectionHeaderDateRow
                                                }
                                            >
                                                <Entypo
                                                    name="cycle"
                                                    size={13}
                                                    color={colors.muted}
                                                />
                                                <Text
                                                    style={
                                                        ui.shabbatSectionHeaderRight
                                                    }
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
                                    <RowLine
                                        label="Sundown"
                                        value={friSundownValue}
                                    />

                                    <View style={ui.settingsDivider} />

                                    {/* Saturday header */}
                                    <View
                                        style={[
                                            ui.shabbatSectionHeaderRow,
                                            { marginVertical: 10 },
                                        ]}
                                    >
                                        <Text
                                            style={ui.shabbatSectionHeaderLeft}
                                        >
                                            Saturday
                                        </Text>

                                        <Pressable
                                            onPress={() => {
                                                Haptics.impactAsync(
                                                    Haptics.ImpactFeedbackStyle
                                                        .Light
                                                );
                                                setShowHebrewSat((v) => !v);
                                            }}
                                            hitSlop={12}
                                            style={
                                                ui.shabbatSectionHeaderDatePressable
                                            }
                                        >
                                            <View
                                                style={
                                                    ui.shabbatSectionHeaderDateRow
                                                }
                                            >
                                                <Entypo
                                                    name="cycle"
                                                    size={13}
                                                    color={colors.muted}
                                                />
                                                <Text
                                                    style={
                                                        ui.shabbatSectionHeaderRight
                                                    }
                                                    numberOfLines={1}
                                                >
                                                    {showHebrewSat
                                                        ? shabbatInfo.yomShabbatHebrewDate
                                                        : shabbatInfo.yomShabbatGregDate}
                                                </Text>
                                            </View>
                                        </Pressable>
                                    </View>

                                    <RowLine
                                        label="Sundown"
                                        value={satSundownValue}
                                    />
                                    <RowLine
                                        label="Shabbat ends"
                                        value={endsValue}
                                    />

                                    <View style={ui.settingsDivider} />

                                    {/* Parasha (same line, toggle on name) */}
                                    {canShowParsha ? (
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                flexWrap: "wrap",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Text
                                                style={[
                                                    ui.shabbatSentenceSmall,
                                                    { marginBottom: 0 },
                                                ]}
                                            >
                                                This week’s parasha is{" "}
                                            </Text>

                                            <Pressable
                                                onPress={() => {
                                                    Haptics.impactAsync(
                                                        Haptics
                                                            .ImpactFeedbackStyle
                                                            .Light
                                                    );
                                                    setShowParshaHeb((v) => !v);
                                                }}
                                                hitSlop={12}
                                                style={{
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    gap: 6,
                                                    paddingVertical: 6,
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
                                                        showParshaHeb
                                                            ? ui.shabbatParshaHebrew
                                                            : null,
                                                    ]}
                                                >
                                                    {showParshaHeb
                                                        ? shabbatInfo.parshaHebrew
                                                        : shabbatInfo.parshaEnglish}
                                                </Text>
                                            </Pressable>
                                        </View>
                                    ) : (
                                        <Text
                                            style={[
                                                ui.shabbatSentenceSmall,
                                                { marginBottom: 0 },
                                            ]}
                                        >
                                            This week’s holiday Torah reading
                                            replaces the parasha.
                                        </Text>
                                    )}
                                </View>
                            ) : (
                                <View style={[ui.card, { marginBottom: 10 }]}>
                                    <Text style={ui.shabbatSentence}>
                                        {loading
                                            ? "Loading Shabbat info..."
                                            : "No Shabbat info."}
                                    </Text>
                                </View>
                            )}

                            {/* Location chip pinned just above bottom nav */}
                            <View style={{ paddingBottom: 8 }}>
                                <Pressable
                                    onPress={() => {
                                        setShowLocationDetails(true);
                                        Haptics.impactAsync(
                                            Haptics.ImpactFeedbackStyle.Light
                                        );
                                    }}
                                    style={[
                                        ui.shabbatLocationChip,
                                        { alignSelf: "flex-start" },
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
                            <Text style={ui.shabbatSheetLabel}>Timezone</Text>
                            <Text style={ui.shabbatSheetValue}>
                                {timezone.replace(/_/g, " ")}
                            </Text>
                        </View>

                        <View style={ui.shabbatSheetLine}>
                            <Text style={ui.shabbatSheetLabel}>
                                Coordinates
                            </Text>
                            <Text style={ui.shabbatSheetValue}>
                                {lat != null && lon != null
                                    ? `${lat.toFixed(3)}, ${lon.toFixed(3)}`
                                    : "Unknown"}
                            </Text>
                        </View>

                        <View style={ui.shabbatSheetLine}>
                            <Text style={ui.shabbatSheetLabel}>Elevation</Text>
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
                            To calculate candle lighting, sundown, and Shabbat
                            end times for your area, please enable Location
                            Services for this app.
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
        </View>
    );
}
