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
import ParshaBottomSheet from "../ParshaBottomSheet";

import { parseLocalIso, formatTime12h } from "../../utils/datetime";
import {
    computeShabbatInfo,
    buildShabbatViewModel,
} from "../../lib/computeShabbatInfo";

import { getParshaDataByName } from "../../data/parshiot";

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

function unitLabel(paddedStr, singular, plural) {
    const n = Number(paddedStr); // "01" -> 1
    return n === 1 ? singular : plural;
}

export default function Shabbat() {
    const [fontsLoaded] = useFonts({
        ChutzBold: require("../../assets/fonts/Chutz-Bold.otf"),
    });

    const [loading, setLoading] = useState(true);
    const [shabbatInfo, setShabbatInfo] = useState(null);

    const [showLocationDetails, setShowLocationDetails] = useState(false);

    // Parsha modal
    const [activeParsha, setActiveParsha] = useState(null);

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
     * - normal: tick every 10s (keeps countdown alive but light)
     * - override: freeze now at local noon of override day (and do NOT tick)
     */
    const [now, setNow] = useState(() => new Date());
    useEffect(() => {
        if (isDevOverride) {
            const frozen = localNoonFromIso(todayIso) ?? new Date();
            setNow(frozen);
            return;
        }
        const t = setInterval(() => setNow(new Date()), 10000);
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
                now,
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

    const vm = useMemo(() => {
        const base = buildShabbatViewModel(shabbatInfo, now, { isDevOverride });

        // Override to still show the countdown but frozen:
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

    const onParshaPress = useCallback(() => {
        if (!shabbatInfo?.parshaEnglish) return;

        const data = getParshaDataByName(shabbatInfo.parshaEnglish);
        if (!data) return;

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setActiveParsha(data);
    }, [shabbatInfo?.parshaEnglish]);

    function normalizeParshaName(name) {
        if (!name || typeof name !== "string") return "";
        return name
            .replace(/^Parashat\s+/i, "") // remove "Parashat "
            .replace(/\u2019/g, "'") // normalize curly apostrophe if present
            .replace(/\s+/g, " ") // collapse spaces
            .trim();
    }

    function openParshaSheet() {
        const raw = shabbatInfo?.parshaEnglish;
        if (!raw) return;

        const norm = normalizeParshaName(raw);

        // 1) Try direct lookup by name
        let data = getParshaDataByName(norm);

        // 2) If it's a double-parsha like "Achrei Mot-Kedoshim"
        if (!data && norm.includes("-")) {
            data = getParshaDataByName(norm.replace(/\s*-\s*/g, "-"));
        }

        // 3) Last resort: try key function
        if (!data) {
            const key = parshaNameToKey(norm);
            data = PARSHIOT?.[key] ?? null;
        }

        if (data) {
            setActiveParsha(data);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } else {
            console.log("[Parsha] No match for:", raw, "=>", norm);
        }
    }

    if (!fontsLoaded) return null;

    return (
        <View style={ui.safeArea}>
            <ScrollView
                style={ui.screen}
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingBottom: tabBarHeight + 10,
                }}
                showsVerticalScrollIndicator={false}
                bounces
                alwaysBounceVertical
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
                            <View style={ui.shabbatHeroWrap}>
                                {vm.status.isDuring ? (
                                    <Text
                                        style={[
                                            ui.holidaysBigBoldText,
                                            ui.textChutz,
                                        ]}
                                    >
                                        Shabbat Shalom
                                    </Text>
                                ) : (
                                    <Text style={ui.holidaysHeaderText}>
                                        Shabbat begins in
                                    </Text>
                                )}
                            </View>

                            {vm.countdown?.show && !vm.status.isDuring ? (
                                <View style={ui.shabbatCountdownCard}>
                                    <View style={ui.shabbatCountdownItem}>
                                        <Text style={ui.shabbatCountdownNumber}>
                                            {vm.countdown.parts.days}
                                        </Text>
                                        <Text style={ui.shabbatCountdownLabel}>
                                            {unitLabel(
                                                vm.countdown.parts.days,
                                                "Day",
                                                "Days"
                                            )}
                                        </Text>
                                    </View>

                                    <View style={ui.shabbatCountdownItem}>
                                        <Text style={ui.shabbatCountdownNumber}>
                                            {vm.countdown.parts.hours}
                                        </Text>
                                        <Text style={ui.shabbatCountdownLabel}>
                                            {unitLabel(
                                                vm.countdown.parts.hours,
                                                "Hour",
                                                "Hours"
                                            )}
                                        </Text>
                                    </View>

                                    <View style={ui.shabbatCountdownItem}>
                                        <Text style={ui.shabbatCountdownNumber}>
                                            {vm.countdown.parts.mins}
                                        </Text>
                                        <Text style={ui.shabbatCountdownLabel}>
                                            {unitLabel(
                                                vm.countdown.parts.mins,
                                                "Minute",
                                                "Minutes"
                                            )}
                                        </Text>
                                    </View>
                                </View>
                            ) : null}
                        </View>

                        {/* ===== BOTTOM STACK ===== */}
                        <View style={{ width: "100%" }}>
                            {shabbatInfo ? (
                                <View style={[ui.card, { marginBottom: 10 }]}>
                                    {/* Friday header (no date toggle) */}
                                    <View style={ui.shabbatSectionHeaderRow}>
                                        <Text
                                            style={ui.shabbatSectionHeaderLeft}
                                        >
                                            Friday
                                        </Text>
                                        <Text
                                            style={ui.shabbatSectionHeaderRight}
                                            numberOfLines={1}
                                        >
                                            {shabbatInfo.erevShabbatGregDate}
                                        </Text>
                                    </View>

                                    <RowLine
                                        label="Candle lighting"
                                        value={candleValue}
                                    />
                                    <RowLine
                                        label="Sundown"
                                        value={friSundownValue}
                                    />

                                    <View style={ui.sheetDivider} />

                                    {/* Saturday header (no date toggle) */}
                                    <View style={ui.shabbatSectionHeaderRow}>
                                        <Text
                                            style={ui.shabbatSectionHeaderLeft}
                                        >
                                            Saturday
                                        </Text>
                                        <Text
                                            style={ui.shabbatSectionHeaderRight}
                                            numberOfLines={1}
                                        >
                                            {shabbatInfo.yomShabbatGregDate}
                                        </Text>
                                    </View>

                                    <RowLine
                                        label="Sundown"
                                        value={satSundownValue}
                                    />
                                    <RowLine
                                        label="Shabbat ends"
                                        value={endsValue}
                                    />

                                    <View style={ui.sheetDivider} />

                                    {/* Parasha */}
                                    {canShowParsha ? (
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            {/* Left: label + parsha name */}
                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                    flexWrap: "wrap",
                                                    flexShrink: 1,
                                                }}
                                            >
                                                <Text
                                                    style={
                                                        ui.shabbatSentenceSmall
                                                    }
                                                >
                                                    Torah portion:{" "}
                                                </Text>

                                                <Pressable
                                                    onPress={openParshaSheet}
                                                    hitSlop={12}
                                                >
                                                    <Text
                                                        style={
                                                            ui.shabbatParshaSmall
                                                        }
                                                    >
                                                        {
                                                            shabbatInfo.parshaEnglish
                                                        }
                                                    </Text>
                                                </Pressable>
                                            </View>

                                            {/* Right: kebab menu */}
                                            <Pressable
                                                onPress={openParshaSheet}
                                                hitSlop={12}
                                                style={{ paddingLeft: 12 }}
                                            >
                                                <Entypo
                                                    name="dots-three-vertical"
                                                    size={16}
                                                    color={colors.muted}
                                                />
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

                            {/* Location chip */}
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
            </ScrollView>

            {/* Location bottom sheet */}
            <LocationBottomSheet
                visible={showLocationDetails}
                onClose={() => setShowLocationDetails(false)}
                title="Location"
                snapPoints={["25%", "55%"]}
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

            {/* Parasha bottom sheet (reuses LocationBottomSheet styling) */}
            <ParshaBottomSheet
                visible={!!activeParsha}
                onClose={() => setActiveParsha(null)}
                english={activeParsha?.english}
                hebrew={activeParsha?.hebrew}
                verses={activeParsha?.verses}
                blurb={activeParsha?.blurb}
                snapPoints={["35%", "65%"]}
            />
        </View>
    );
}
