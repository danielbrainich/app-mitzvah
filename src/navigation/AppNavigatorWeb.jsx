import React, { useState, useCallback, useMemo, useRef } from "react";
import {
    View,
    Text,
    Pressable,
    ScrollView,
    StyleSheet,
    Linking,
    Animated,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Entypo, Feather, AntDesign } from "@expo/vector-icons";

import {
    colors as tokenColors,
    spacing,
    typography,
    radii,
} from "../constants/design-tokens";
import { getHolidayDetailsByName } from "../utils/getHolidayDetails";
import { getParshaDataByName } from "../data/parshiot";
import {
    formatGregorianLongFromIso,
    formatHebrewLongFromIso,
} from "../utils/datetime";

import { useHolidayData } from "../hooks/useHolidayData";
import { useShabbatData } from "../hooks/useShabbatData";
import { useCurrentTime } from "../hooks/useCurrentTime";
import useAppLocation from "../hooks/useAppLocation";
import useTodayIsoDay from "../hooks/useTodayIsoDay";
import { useShabbatSettings } from "../hooks/useShabbatSettings";
import { buildShabbatViewModel } from "../lib/computeShabbatInfo";

import TodaySection from "../components/holidays/TodaySection";
import UpcomingHolidayCard from "../components/holidays/UpcomingHolidayCard";
import ParshaCard from "../components/shabbat/ParshaCard";
import ShabbatHero from "../components/shabbat/ShabbatHero";
import LocationChip from "../components/shabbat/LocationChip";
import ShabbatTimesCard from "../components/shabbat/ShabbatTimesCard";

import {
    toggleMinorFasts,
    toggleRosheiChodesh,
    toggleModernHolidays,
    toggleSpecialShabbatot,
} from "../store/slices/settingsSlice";
import SettingsCard from "../components/settings/SettingsCard";
import SettingSwitch from "../components/settings/SettingSwitch";
import SettingSlider from "../components/settings/SettingSlider";

const CARD_WIDTH = 460;
const CARD_HEIGHT = 640;
const BOTTOM_INSET = 56;

// ─── Icon Button with hover ───────────────────────────────────────────────────

function IconBtn({ onPress, hitSlop, style, children }) {
    const [hovered, setHovered] = useState(false);
    return (
        <Pressable
            onPress={onPress}
            hitSlop={hitSlop}
            style={style}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <View style={{ opacity: hovered ? 1 : 0.45 }}>{children}</View>
        </Pressable>
    );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function Modal({ visible, onClose, children }) {
    const anim = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.spring(anim, {
            toValue: visible ? 1 : 0,
            tension: 80,
            friction: 14,
            useNativeDriver: true,
        }).start();
    }, [visible]);

    if (!visible) return null;

    const scale = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.94, 1],
    });
    const opacity = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    return (
        <View style={m.overlay} pointerEvents="box-none">
            <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
                <Animated.View
                    style={[
                        StyleSheet.absoluteFill,
                        m.scrim,
                        {
                            opacity: anim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, 0.55],
                            }),
                        },
                    ]}
                />
            </Pressable>
            <Animated.View
                style={[m.modal, { opacity, transform: [{ scale }] }]}
            >
                <Pressable onPress={onClose} style={m.closeBtn} hitSlop={12}>
                    <Entypo
                        name="cross"
                        size={16}
                        color={tokenColors.text.muted}
                    />
                </Pressable>
                {children}
            </Animated.View>
        </View>
    );
}

const m = StyleSheet.create({
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 24,
        overflow: "hidden",
        zIndex: 50,
        padding: spacing[6],
    },
    scrim: { backgroundColor: "#000" },
    modal: {
        width: "75%",
        aspectRatio: 1,
        backgroundColor: "#1e1e1e",
        borderRadius: 16,
        padding: spacing[7],
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.08)",
        overflow: "hidden",
    },
    closeBtn: {
        position: "absolute",
        top: spacing[4],
        right: spacing[4],
        width: 28,
        height: 28,
        borderRadius: radii.full,
        backgroundColor: "rgba(255,255,255,0.08)",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
    },
});

// ─── Holidays Tab ─────────────────────────────────────────────────────────────

function HolidaysTab() {
    const { todayHolidays, upcoming } = useHolidayData();
    const [sheetHoliday, setSheetHoliday] = useState(null);

    const openAbout = useCallback((holiday) => {
        if (!holiday) return;
        setSheetHoliday(holiday);
    }, []);

    const description = sheetHoliday
        ? getHolidayDetailsByName(sheetHoliday.title)?.description ??
          "No description available."
        : null;

    return (
        <View style={s.tabRoot}>
            <ScrollView
                style={s.tabScroll}
                contentContainerStyle={[s.tabScrollContent, { flexGrow: 1 }]}
                showsVerticalScrollIndicator={false}
            >
                <View style={s.heroSection}>
                    <TodaySection
                        todayHolidays={todayHolidays}
                        onAbout={openAbout}
                    />
                </View>

                <View style={{ flex: 1 }} />

                <View style={s.section}>
                    <Text style={s.sectionLabel}>Upcoming holidays</Text>
                    <View style={[s.carouselWrapper, { overflow: "visible" }]}>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={s.carouselContent}
                            style={s.carousel}
                        >
                            {upcoming.map((holiday) => (
                                <View key={holiday.id} style={s.carouselCard}>
                                    <UpcomingHolidayCard
                                        holiday={holiday}
                                        onAbout={openAbout}
                                    />
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </ScrollView>

            <Modal
                visible={!!sheetHoliday}
                onClose={() => setSheetHoliday(null)}
            >
                {sheetHoliday && (
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={s.sheetTitle}>
                            {sheetHoliday.displayTitle}
                        </Text>
                        {sheetHoliday.hebrewTitle ? (
                            <Text style={s.sheetHebrew}>
                                {sheetHoliday.hebrewTitle}
                            </Text>
                        ) : null}
                        <Text style={s.sheetBody}>{description}</Text>
                    </ScrollView>
                )}
            </Modal>
        </View>
    );
}

// ─── Shabbat Tab ──────────────────────────────────────────────────────────────

function ShabbatTab() {
    const { candleLightingTime, havdalahTime } = useSelector(
        (state) => state.settings
    );
    const todayIso = useTodayIsoDay();
    const {
        status: locationStatus,
        location,
        requestPermission,
    } = useAppLocation();
    const hasLocation = locationStatus === "granted" && !!location;

    const candleMins = Number.isFinite(candleLightingTime)
        ? candleLightingTime
        : 18;
    const havdalahMins = Number.isFinite(havdalahTime) ? havdalahTime : 42;

    const { now, isDevOverride } = useCurrentTime(todayIso);
    const { shabbatInfo, loading, timezone } = useShabbatData({
        location: hasLocation ? location : null,
        candleMins,
        havdalahMins,
        now,
    });

    const vm = useMemo(
        () => buildShabbatViewModel(shabbatInfo, now, { isDevOverride }),
        [shabbatInfo, now, isDevOverride]
    );

    const [parshaSheet, setParshaSheet] = useState(null);
    const [locationSheet, setLocationSheet] = useState(false);

    const handleParshaPress = useCallback(() => {
        if (!shabbatInfo?.parshaEnglish) return;
        const data = getParshaDataByName(shabbatInfo.parshaEnglish);
        if (data) setParshaSheet(data);
    }, [shabbatInfo?.parshaEnglish]);

    const handleEnableLocation = useCallback(async () => {
        const status = await requestPermission();
        if (status !== "granted") Linking.openURL("app-settings:");
    }, [requestPermission]);

    return (
        <View style={s.tabRoot}>
            <ScrollView
                style={s.tabScroll}
                contentContainerStyle={s.tabScrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={[s.heroSection, { minHeight: 120 }]}>
                    <ShabbatHero
                        status={vm.status}
                        hasLocation={hasLocation}
                        shabbatInfo={shabbatInfo}
                        candleMins={candleMins}
                        havdalahMins={havdalahMins}
                        now={now}
                        onShowDetails={() => {}}
                    />
                </View>

                <View style={s.shabbatGrid}>
                    <View style={s.shabbatCol}>
                        <Text style={s.sectionLabel}>Shabbat Times</Text>
                        <ShabbatTimesCard
                            shabbatInfo={shabbatInfo}
                            loading={loading}
                        />
                        <View style={{ marginTop: spacing[2] }}>
                            <LocationChip
                                hasLocation={hasLocation}
                                onPress={() => setLocationSheet(true)}
                            />
                        </View>
                    </View>
                    <View style={s.shabbatCol}>
                        <Text style={s.sectionLabel}>Torah Portion</Text>
                        <ParshaCard
                            parshaEnglish={shabbatInfo?.parshaEnglish}
                            parshaHebrew={shabbatInfo?.parshaHebrew?.replace(
                                /^פרשת\s*/,
                                ""
                            )}
                            parshaReplacedByHoliday={
                                shabbatInfo?.parshaReplacedByHoliday
                            }
                            onPress={handleParshaPress}
                        />
                    </View>
                </View>
            </ScrollView>

            <Modal visible={!!parshaSheet} onClose={() => setParshaSheet(null)}>
                {parshaSheet && (
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={s.sheetTitle}>
                            {parshaSheet[0]?.english}
                        </Text>
                        {parshaSheet[0]?.verses ? (
                            <Text style={s.sheetHebrew}>
                                {parshaSheet[0].verses}
                            </Text>
                        ) : null}
                        <Text style={s.sheetBody}>{parshaSheet[0]?.blurb}</Text>
                    </ScrollView>
                )}
            </Modal>

            <Modal
                visible={locationSheet}
                onClose={() => setLocationSheet(false)}
            >
                <Text style={s.sheetTitle}>Location</Text>
                {hasLocation ? (
                    <>
                        <Text style={s.sheetBody}>
                            📍 {location?.latitude?.toFixed(4)},{" "}
                            {location?.longitude?.toFixed(4)}
                        </Text>
                        {timezone ? (
                            <Text style={s.sheetBody}>🕐 {timezone}</Text>
                        ) : null}
                    </>
                ) : (
                    <Pressable onPress={handleEnableLocation}>
                        <Text
                            style={[
                                s.sheetBody,
                                { color: tokenColors.brand.primary },
                            ]}
                        >
                            Enable location access →
                        </Text>
                    </Pressable>
                )}
            </Modal>
        </View>
    );
}

// ─── Settings Panel ───────────────────────────────────────────────────────────

function SettingsPanel() {
    const settings = useSelector((state) => state.settings);
    const { minorFasts, rosheiChodesh, modernHolidays, specialShabbatot } =
        settings;
    const dispatch = useDispatch();
    const {
        candleValue,
        havdalahValue,
        candleDisplayValue,
        havdalahDisplayValue,
        handleCandleLightingToggle,
        handleHavdalahTimeToggle,
        handleCandleValueChange,
        handleHavdalahValueChange,
    } = useShabbatSettings(settings);

    return (
        <ScrollView
            style={s.tabScroll}
            contentContainerStyle={[
                s.tabScrollContent,
                { paddingTop: spacing[9] },
            ]}
            showsVerticalScrollIndicator={false}
        >
            <SettingsCard title="Holiday Options" variant="flat">
                <SettingSwitch
                    label="Include modern holidays"
                    value={modernHolidays}
                    onValueChange={() => dispatch(toggleModernHolidays())}
                />
                <SettingSwitch
                    label="Include minor fasts"
                    value={minorFasts}
                    onValueChange={() => dispatch(toggleMinorFasts())}
                />
                <SettingSwitch
                    label="Include roshei chodesh"
                    value={rosheiChodesh}
                    onValueChange={() => dispatch(toggleRosheiChodesh())}
                />
                <SettingSwitch
                    label="Include special shabbatot"
                    value={specialShabbatot}
                    onValueChange={() => dispatch(toggleSpecialShabbatot())}
                />
            </SettingsCard>
            <View style={s.settingsDivider} />
            <SettingsCard title="Shabbat Options" variant="flat">
                <SettingSwitch
                    label="Custom candle lighting"
                    sublabel={`Minutes before sundown: ${candleDisplayValue}`}
                    value={settings.candleLightingToggle}
                    onValueChange={handleCandleLightingToggle}
                />
                {settings.candleLightingToggle && (
                    <SettingSlider
                        value={candleValue}
                        onValueChange={handleCandleValueChange}
                    />
                )}
                <SettingSwitch
                    label="Custom shabbat end"
                    sublabel={`Minutes after sundown: ${havdalahDisplayValue}`}
                    value={settings.havdalahTimeToggle}
                    onValueChange={handleHavdalahTimeToggle}
                />
                {settings.havdalahTimeToggle && (
                    <SettingSlider
                        value={havdalahValue}
                        onValueChange={handleHavdalahValueChange}
                    />
                )}
            </SettingsCard>
        </ScrollView>
    );
}

// ─── Info Panel ───────────────────────────────────────────────────────────────

function InfoContent() {
    return (
        <View style={s.infoContent}>
            <Text style={s.infoTitle}>AppMitzvah</Text>
            <Text style={s.infoBody}>
                A Jewish calendar for Shabbat times and holiday tracking.
            </Text>
            <Pressable
                onPress={() => Linking.openURL("https://danielbrainich.com")}
            >
                <Text
                    style={[
                        s.infoBody,
                        {
                            color: tokenColors.brand.primary,
                            marginTop: spacing[4],
                        },
                    ]}
                >
                    Built by dbrainy 🩶
                </Text>
            </Pressable>
            <Text style={[s.infoBody, { marginTop: spacing[6], opacity: 0.3 }]}>
                v2.0.0
            </Text>
        </View>
    );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

const TABS = ["Holidays", "Shabbat"];

export default function AppNavigatorWeb() {
    const [activeTab, setActiveTab] = useState("Holidays");
    const todayIso = useTodayIsoDay();
    const [showHebrew, setShowHebrew] = useState(false);
    const dateLabel = useMemo(
        () =>
            showHebrew
                ? formatHebrewLongFromIso(todayIso)
                : formatGregorianLongFromIso(todayIso),
        [todayIso, showHebrew]
    );

    const [face, setFace] = useState("main");
    const flipAnim = useRef(new Animated.Value(0)).current;
    const tabAnim = useRef(new Animated.Value(1)).current;

    // Per-tab scale animations — Holidays starts active (1.08)
    const tabScales = useRef(
        TABS.reduce((acc, tab) => {
            acc[tab] = new Animated.Value(tab === "Holidays" ? 1.08 : 1);
            return acc;
        }, {})
    ).current;

    const switchTab = useCallback(
        (tab) => {
            // Animate tab label scales with bounce
            TABS.forEach((t) => {
                Animated.spring(tabScales[t], {
                    toValue: t === tab ? 1.08 : 1,
                    tension: 200,
                    friction: 8,
                    useNativeDriver: true,
                }).start();
            });

            // Fade content out, swap, fade in
            Animated.timing(tabAnim, {
                toValue: 0,
                duration: 120,
                useNativeDriver: true,
            }).start(() => {
                setActiveTab(tab);
                Animated.timing(tabAnim, {
                    toValue: 1,
                    duration: 180,
                    useNativeDriver: true,
                }).start();
            });
        },
        [tabAnim, tabScales]
    );

    const flipTo = useCallback(
        (targetFace) => {
            const toValue = targetFace === "main" ? 0 : 1;
            setFace(targetFace);
            Animated.spring(flipAnim, {
                toValue,
                tension: 60,
                friction: 10,
                useNativeDriver: true,
            }).start();
        },
        [flipAnim]
    );

    const frontRotate = flipAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "180deg"],
    });
    const backRotate = flipAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["180deg", "360deg"],
    });

    return (
        <View style={s.page}>
            <View style={s.cardContainer}>
                {/* ── Front face ── */}
                <Animated.View
                    style={[
                        s.card,
                        s.cardFace,
                        { transform: [{ rotateY: frontRotate }] },
                    ]}
                >
                    <View style={s.topLeft}>
                        <IconBtn
                            onPress={() => flipTo("info")}
                            hitSlop={8}
                            style={s.topIconBtn}
                        >
                            <AntDesign
                                name="info-circle"
                                size={20}
                                color={tokenColors.text.primary}
                            />
                        </IconBtn>
                        <IconBtn
                            onPress={() => flipTo("settings")}
                            hitSlop={8}
                            style={s.topIconBtn}
                        >
                            <Entypo
                                name="cog"
                                size={20}
                                color={tokenColors.text.primary}
                            />
                        </IconBtn>
                    </View>

                    <IconBtn
                        onPress={() => setShowHebrew((v) => !v)}
                        style={s.dateLabel}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 5,
                            }}
                        >
                            <Entypo
                                name="cycle"
                                size={13}
                                color={tokenColors.text.primary}
                            />
                            <Text style={s.dateLabelText}>{dateLabel}</Text>
                        </View>
                    </IconBtn>

                    <Animated.View
                        style={[
                            s.content,
                            {
                                opacity: tabAnim,
                                transform: [
                                    {
                                        scale: tabAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0.97, 1],
                                        }),
                                    },
                                ],
                            },
                        ]}
                    >
                        {activeTab === "Holidays" ? (
                            <HolidaysTab />
                        ) : (
                            <ShabbatTab />
                        )}
                    </Animated.View>

                    <View style={s.floatRow}>
                        <View style={s.floatPill}>
                            {TABS.map((tab) => {
                                const isActive = activeTab === tab;
                                return (
                                    <Pressable
                                        key={tab}
                                        onPress={() => switchTab(tab)}
                                        style={s.tab}
                                    >
                                        <Animated.Text
                                            style={[
                                                s.tabText,
                                                isActive && s.tabTextActive,
                                                {
                                                    transform: [
                                                        {
                                                            scale: tabScales[tab],
                                                        },
                                                    ],
                                                },
                                            ]}
                                        >
                                            {tab}
                                        </Animated.Text>
                                    </Pressable>
                                );
                            })}
                        </View>
                    </View>
                </Animated.View>

                {/* ── Back face ── */}
                <Animated.View
                    style={[
                        s.card,
                        s.cardFace,
                        { transform: [{ rotateY: backRotate }] },
                    ]}
                >
                    <View style={s.topLeft}>
                        <IconBtn
                            onPress={() => flipTo("main")}
                            hitSlop={12}
                            style={s.topIconBtn}
                        >
                            <Feather
                                name="arrow-left"
                                size={24}
                                color={tokenColors.text.primary}
                            />
                        </IconBtn>
                    </View>

                    <View style={s.content}>
                        {face === "settings" ? (
                            <SettingsPanel />
                        ) : (
                            <InfoContent />
                        )}
                    </View>
                </Animated.View>
            </View>
        </View>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: "#1C1C1E",
        alignItems: "center",
        justifyContent: "center",
    },
    cardContainer: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        perspective: 1200,
        position: "relative",
    },
    card: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        backgroundColor: "#252525",
        borderRadius: 24,
        overflow: "hidden",
    },
    cardFace: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backfaceVisibility: "hidden",
    },

    // Top-left icon cluster (info + cog on front, arrow on back)
    topLeft: {
        position: "absolute",
        top: spacing[3],
        left: spacing[5],
        flexDirection: "row",
        alignItems: "center",
        gap: spacing[1],
        zIndex: 10,
    },
    topIconBtn: {
        width: 28,
        height: 28,
        alignItems: "center",
        justifyContent: "center",
    },

    // Date label — top right
    dateLabel: {
        position: "absolute",
        top: spacing[3],
        right: spacing[5],
        zIndex: 10,
        paddingVertical: 4,
        paddingHorizontal: 2,
    },
    dateLabelText: {
        fontSize: 13,
        color: tokenColors.text.primary,
        letterSpacing: 0.2,
    },

    // Content
    content: { flex: 1, overflow: "hidden" },
    tabRoot: { flex: 1, position: "relative" },
    tabScroll: { flex: 1 },
    tabScrollContent: {
        paddingHorizontal: spacing[6],
        paddingTop: spacing[8],
        paddingBottom: BOTTOM_INSET + 8,
    },

    heroSection: {
        minHeight: 160,
        paddingTop: 60,
        paddingBottom: spacing[2],
    },

    // Bottom nav — centered
    floatRow: {
        position: "absolute",
        bottom: spacing[4],
        left: 0,
        right: 0,
        alignItems: "center",
    },
    floatPill: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(20,20,20,0.92)",
        borderRadius: radii.full,
        paddingHorizontal: spacing[2],
        paddingVertical: spacing[2],
        gap: 2,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.07)",
    },
    tab: {
        paddingVertical: 5,
        paddingHorizontal: spacing[4],
        borderRadius: radii.full,
    },
    tabText: {
        fontSize: 13,
        color: tokenColors.text.muted,
        fontWeight: "500",
    },
    tabTextActive: {
        color: tokenColors.text.primary,
        fontWeight: "600",
    },

    // Sections
    section: { marginTop: spacing[3] },
    sectionLabel: {
        fontSize: 14,
        color: tokenColors.text.primary,
        letterSpacing: 0.8,
        marginBottom: spacing[2],
    },

    // Carousel
    carouselWrapper: {
        height: 90,
        marginHorizontal: -spacing[6],
    },
    carousel: { flex: 1 },
    carouselContent: {
        paddingHorizontal: spacing[6],
        paddingRight: spacing[6],
        gap: spacing[3],
        alignItems: "stretch",
    },
    carouselCard: {
        width: (CARD_WIDTH - spacing[6] * 2 - spacing[3]) / 2.2,
    },

    // Shabbat grid
    shabbatGrid: {
        flexDirection: "row",
        gap: spacing[4],
        marginTop: spacing[2],
    },
    shabbatCol: { flex: 1 },

    // Settings divider
    settingsDivider: {
        height: 1,
        backgroundColor: "rgba(255,255,255,0.06)",
        marginVertical: spacing[4],
    },

    // Modal content
    sheetTitle: {
        fontSize: typography.size.xl,
        fontWeight: "600",
        color: tokenColors.brand.primary,
        marginBottom: spacing[2],
        paddingRight: spacing[8],
    },
    sheetHebrew: {
        fontSize: typography.size.lg,
        color: tokenColors.brand.primary,
        writingDirection: "rtl",
        opacity: 0.85,
        marginBottom: spacing[4],
    },
    sheetBody: {
        fontSize: typography.size.sm,
        color: tokenColors.text.primary,
        lineHeight: 22,
        marginTop: spacing[2],
    },

    // Info face
    infoContent: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: spacing[8],
        paddingTop: spacing[6],
    },
    infoTitle: {
        fontSize: typography.size["2xl"],
        fontWeight: "700",
        color: tokenColors.text.primary,
        marginBottom: spacing[3],
        fontFamily: "ChutzBold",
    },
    infoBody: {
        fontSize: typography.size.sm,
        color: tokenColors.text.muted,
        textAlign: "center",
        lineHeight: 20,
    },
});
