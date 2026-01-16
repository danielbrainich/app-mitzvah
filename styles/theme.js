// styles/theme.js
import { StyleSheet } from "react-native";

/**
 * Shared app styles (single stylesheet).
 *
 * Convention:
 * - Generic names = reusable across screens (container, screen, card, etc.)
 * - Screen-specific names = prefixed (info*, shabbat*, holidays*, settings*, etc.)
 */

const COLORS = {
    // Base
    bg: "black",
    card: "#1A1A1A",
    white: "white",
    muted: "rgba(255,255,255,0.65)",

    // Text
    textPrimary: "rgba(255,255,255,0.92)",
    textBody: "rgba(255,255,255,0.88)",
    textMuted: "rgba(255,255,255,0.78)",

    // Accent
    accent: "#82CBFF",
    accentBorder: "rgba(130,203,255,0.65)",
    accentBg: "rgba(130,203,255,0.14)",

    // Borders
    pillBorder: "rgba(255,255,255,0.22)",
};

export const colors = {
    // Exported only for rare inline styles (avoid if possible).
    ...COLORS,
};

/**
 * Non-StyleSheet config objects (React Navigation likes plain objects)
 */
export const nav = {
    topSpacer: { height: 48 },

    sceneContainer: { backgroundColor: COLORS.bg },

    tabBarBackground: {
        flex: 1,
        backgroundColor: COLORS.card,
        borderRadius: 18,
    },

    tabBarStyle: {
        position: "absolute",
        left: 16,
        right: 16,
        bottom: 8,
        height: 64,
        borderTopWidth: 0,
        marginHorizontal: 24,
        paddingTop: 0,
        paddingBottom: 0,
    },

    tabBarItemStyle: {
        flex: 1,
        margin: 8,
        borderRadius: 10,
    },

    tabBarLabelStyle: {
        fontSize: 16,
        fontWeight: "500",
        height: 34,
    },

    tabBarActiveBg: "#313131",
};

export const ui = StyleSheet.create({
    // ===========================================================================
    // LAYOUT (shared)
    // ===========================================================================
    container: {
        flex: 1,
        backgroundColor: COLORS.bg,
    },

    safeArea: {
        flex: 1,
        backgroundColor: COLORS.bg,
    },

    topSpacer: {
        height: 48,
    },

    screen: {
        paddingHorizontal: 8,
    },

    // ===========================================================================
    // ROWS (shared)
    // ===========================================================================
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 10,
    },

    rowLeft: {
        flex: 1,
        paddingRight: 12,
    },

    // ===========================================================================
    // CARDS (shared)
    // ===========================================================================
    card: {
        backgroundColor: COLORS.card,
        borderRadius: 18,
        padding: 18,
        marginBottom: 18,
    },

    cardTitle: {
        color: COLORS.accent,
        fontSize: 26,
        marginBottom: 6,
        fontWeight: "700",
    },

    // ===========================================================================
    // TYPOGRAPHY (shared)
    // ===========================================================================
    paragraph: {
        color: COLORS.white,
        fontSize: 16,
        lineHeight: 22,
        marginBottom: 10,
    },

    link: {
        color: COLORS.accent,
        fontSize: 16,
        fontWeight: "600",
        textDecorationLine: "underline",
    },

    // ===========================================================================
    // BUTTONS (shared)
    // ===========================================================================
    primaryButton: {
        marginTop: 2,
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: "center",
        borderWidth: 0.5,
        borderColor: COLORS.accent,
        backgroundColor: "transparent",
    },

    primaryButtonText: {
        color: COLORS.accent,
        fontSize: 16,
        fontWeight: "800",
    },

    // ===========================================================================
    // SCROLL HELPERS (shared)
    // ===========================================================================
    scrollContent: {
        flexGrow: 1,
    },

    // ===========================================================================
    // INFO SCREEN
    // ===========================================================================
    infoTiersRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 18,
        marginTop: 4,
    },

    infoTierPill: {
        width: 56,
        alignItems: "center",
        borderWidth: 1,
        borderColor: COLORS.pillBorder,
        borderRadius: 999,
        paddingVertical: 8,
        backgroundColor: "transparent",
    },

    infoTierPillSelected: {
        borderColor: COLORS.accentBorder,
        backgroundColor: COLORS.accentBg,
    },

    infoTierText: {
        color: COLORS.textMuted,
        fontSize: 14,
        fontWeight: "700",
    },

    infoTierTextSelected: {
        color: COLORS.accent,
    },

    infoBottomSpacer: {
        height: 28,
    },

    // ===========================================================================
    // SHABBAT SCREEN
    // ===========================================================================
    shabbatIntro: {
        color: COLORS.white,
        fontSize: 30,
        marginVertical: 16,
    },

    shabbatSentence: {
        color: COLORS.textPrimary,
        fontSize: 14,
        marginBottom: 16,
    },

    shabbatSentenceSmall: {
        color: COLORS.textPrimary,
        fontSize: 16,
        lineHeight: 22,
        marginBottom: 6,
    },

    shabbatMuted: {
        color: "rgba(255,255,255,0.75)",
    },

    shabbatFooter: {
        marginTop: 4,
    },

    shabbatSheetLine: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },

    shabbatSheetLabel: {
        color: COLORS.white,
        fontSize: 16,
    },

    shabbatSheetValue: {
        color: COLORS.white,
        fontSize: 16,
        maxWidth: "60%",
        textAlign: "right",
    },

    shabbatLocationNotice: {
        borderRadius: 12,
        padding: 14,
        backgroundColor: COLORS.bg,
    },

    shabbatLocationNoticeTitle: {
        color: COLORS.white,
        fontSize: 16,
        marginBottom: 6,
        fontWeight: "500",
    },

    shabbatLocationNoticeBody: {
        color: COLORS.white,
        opacity: 0.9,
        fontSize: 14,
        lineHeight: 18,
        marginBottom: 10,
    },

    shabbatCta: {
        borderWidth: 0.5,
        borderColor: COLORS.accent,
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 12,
        alignSelf: "flex-start",
    },

    shabbatCtaText: {
        color: COLORS.accent,
        fontSize: 12,
        fontWeight: "600",
    },

    shabbatLocationChip: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.18)",
        backgroundColor: COLORS.bg,
    },

    shabbatLocationChipInline: {
        position: "relative",
        alignSelf: "flex-start",
    },

    shabbatGreenDot: {
        width: 10,
        height: 10,
        borderRadius: 99,
        backgroundColor: "#35D07F",
    },

    shabbatLocationChipText: {
        color: COLORS.white,
        fontSize: 14,
        opacity: 0.9,
    },

    // ===========================================================================
    // SETTINGS SCREEN
    // ===========================================================================
    settingsSafe: {
        flex: 1,
        backgroundColor: COLORS.bg,
    },

    settingsTopBar: {
        height: 44,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
    },

    settingsBackBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255,255,255,0.06)",
    },

    settingsScrollContent: {
        flexGrow: 1,
        paddingTop: 10,
    },

    settingsDivider: {
        height: 1,
        backgroundColor: "rgba(255,255,255,0.08)",
        marginTop: 16,
        marginHorizontal: 4,
    },

    settingsRowLabel: {
        color: COLORS.white,
        fontSize: 18,
        lineHeight: 22,
    },

    settingsSubLabel: {
        color: "rgba(255,255,255,0.72)",
        fontSize: 14,
        marginTop: 6,
    },

    settingsSliderBlock: {
        paddingBottom: 10,
    },

    settingsSliderHeader: {
        flexDirection: "row",
        alignItems: "baseline",
        justifyContent: "space-between",
        marginBottom: 8,
    },

    settingsSliderValue: {
        color: COLORS.accent,
        fontSize: 14,
        fontWeight: "500",
    },

    settingsSliderHint: {
        color: COLORS.accent,
        fontSize: 14,
        fontWeight: "500",
    },

    // ===========================================================================
    // HOLIDAYS SCREEN
    // ===========================================================================
    holidaysTodaySection: {
        flexShrink: 1,
    },

    holidaysTodayPagerSlot: {
        justifyContent: "center",
        paddingTop: 6,
    },

    holidaysNoHolidayWrap: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 16,
    },

    holidaysBigBoldText: {
        color: COLORS.accent,
        fontSize: 66,
        textAlign: "center",
        marginTop: 12,
        marginBottom: 8,
    },

    holidaysComingUpSection: {
        marginTop: "auto",
        paddingTop: 14,
    },

    holidaysSecondHeaderText: {
        color: COLORS.white,
        fontSize: 20,
        marginBottom: 14,
    },

    holidaysUpcomingCarouselSlot: {
        // height is set in-screen via [style, { height: UPCOMING_HEIGHT }]
    },

    holidaysHeaderText: {
        color: COLORS.white,
        fontSize: 30,
        marginTop: 12,
        marginBottom: 0,
    },

    // Dots (shared for carousels)
    carouselDotsRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        marginBottom: 4,
    },

    carouselDot: {
        backgroundColor: "rgba(255,255,255,0.22)",
    },

    carouselDotActive: {
        backgroundColor: "rgba(130,203,255,0.95)",
    },

    // TodayHolidayCarousel helpers
    todayCarouselWrap: {
        width: "100%",
    },

    todayCarouselPage: {
        // width + height are set dynamically
    },

    // ===========================================================================
    // TODAY HOLIDAY CARD
    // ===========================================================================
    todayHolidayCard: {
        backgroundColor: COLORS.card,
        borderRadius: 18,
        padding: 18,
        paddingTop: 16,
        justifyContent: "space-between",
    },

    todayHolidayHeaderText: {
        color: COLORS.white,
        fontSize: 30,
        marginBottom: 12,
    },

    todayHolidayTitleRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 10,
    },

    todayHolidayTitle: {
        flex: 1,
        color: COLORS.accent,
        fontFamily: "ChutzBold",
        fontSize: 64,
        lineHeight: 66,
        textAlign: "center",
    },

    todayHolidayHebrew: {
        color: COLORS.accent,
        fontSize: 22,
        marginTop: 0,
    },

    todayHolidayDate: {
        color: "rgba(255,255,255,0.9)",
        fontSize: 16,
        marginTop: 12,
    },

    todayHolidayMoreInfoButton: {
        borderRadius: 18,
        padding: 12,
        alignItems: "center",
        borderWidth: 0.5,
        borderColor: COLORS.white,
        backgroundColor: "transparent",
        marginVertical: 24,
    },

    todayHolidayMoreInfoButtonText: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: "500",
    },

    todayHolidayDrawerHebrew: {
        color: COLORS.accent,
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 12,
        opacity: 0.95,
    },

    todayHolidayDrawerBody: {
        color: COLORS.white,
        fontSize: 16,
        lineHeight: 21,
    },

    // ===========================================================================
    // UPCOMING HOLIDAY CARD
    // ===========================================================================
    upcomingHolidayCard: {
        backgroundColor: COLORS.card,
        borderRadius: 18,
        padding: 18,
        position: "relative",
    },

    upcomingHolidayTitle: {
        fontFamily: "ChutzBold",
        color: COLORS.accent,
        fontSize: 24,
        marginBottom: 4,
        marginTop: 4,
    },

    upcomingHolidayHebrew: {
        color: COLORS.accent,
        fontSize: 16,
        marginBottom: 6,
    },

    upcomingHolidayDate: {
        color: COLORS.white,
        fontSize: 14,
    },

    upcomingHolidayMoreBtn: {
        position: "absolute",
        top: 12,
        right: 12,
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
    },

    // UpcomingHolidaysCarousel helpers
    holidaysUpcomingCarouselWrap: {
        // height is dynamic via inline { height }
    },

    holidaysUpcomingCarouselContent: {
        paddingLeft: 0,
        // paddingRight is dynamic (peek)
    },

    holidaysUpcomingCarouselSeparator: {
        // width is dynamic (gap)
    },

    holidaysUpcomingCarouselItemWrap: {
        // width is dynamic (cardWidth)
    },

    // ===========================================================================
    // BOTTOM SHEET (shared)
    // ===========================================================================
    bottomSheetBg: {
        backgroundColor: COLORS.card,
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
    },

    bottomSheetHandle: {
        backgroundColor: "rgba(255,255,255,0.25)",
        width: 44,
    },

    bottomSheetContent: {
        flex: 1,
    },

    sheetTopRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingHorizontal: 12,
        paddingBottom: 4,
    },

    bottomSheetCloseBtn: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
    },

    sheetHeader: {
        paddingTop: 8,
        paddingBottom: 12,
    },

    sheetMetaRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 8,
    },

    sheetMetaLeft: {
        color: COLORS.white,
        fontSize: 16,
        flexShrink: 1,
        paddingRight: 10,
    },

    sheetMetaRight: {
        color: COLORS.white,
        fontSize: 16,
        textAlign: "right",
        flexShrink: 1,
        paddingLeft: 10,
    },

    sheetBody: {
        paddingHorizontal: 18,
        paddingBottom: 18,
        paddingTop: 4,
    },

    sheetBodyText: {
        color: COLORS.white,
        fontSize: 16,
        lineHeight: 21,
    },

    sheetNameRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        flexWrap: "wrap",
        rowGap: 6,
    },

    sheetNameLeft: {
        color: COLORS.accent,
        fontSize: 22,
        fontFamily: "ChutzBold",
        flexGrow: 1,
        flexBasis: "50%",
        paddingRight: 12,
    },

    sheetNameRight: {
        color: COLORS.accent,
        fontSize: 16,
        opacity: 0.9,
        textAlign: "right",
        writingDirection: "rtl",
        flexGrow: 1,
        flexBasis: "50%",
        paddingLeft: 12,
    },

    bottomSheetTitle: {
        color: COLORS.accent,
        fontSize: 20,
        marginBottom: 14,
    },

    // ===========================================================================
    // LOCATION SHEET
    // ===========================================================================
    locationSheetBody: {
        paddingHorizontal: 16,
        paddingBottom: 22,
    },

    locationSheetTitle: {
        color: COLORS.accent,
        fontSize: 20,
        marginBottom: 14,
        fontFamily: "ChutzBold",
    },

    locationSheetSpacer: {
        height: 12,
    },

    // ===========================================================================
    // TOP BAR (shared)
    // ===========================================================================
    topBarSafe: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
    },

    topBarWrap: {
        height: 44,
        paddingHorizontal: 16,
        justifyContent: "center",
        position: "relative",
    },

    topBarDatePressable: {
        position: "absolute",
        left: 16,
        paddingVertical: 6,
    },

    topBarDatePill: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        borderRadius: 18,
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: COLORS.card,
    },

    topBarDateText: {
        color: COLORS.white,
        fontSize: 14,
    },

    topBarDevDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.accent,
        marginLeft: 4,
    },

    topBarIconBtn: {
        width: 38,
        height: 38,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.card,
    },

    topBarGearBtn: {
        position: "absolute",
        right: 16,
    },

    topBarKebabBtn: {
        position: "absolute",
        right: 16 + 38 + 10,
    },

    // DEV modal
    devModalBackdrop: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.55)",
    },

    devModalCard: {
        marginTop: 90,
        marginHorizontal: 16,
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.08)",
    },

    devModalTitle: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: "600",
    },

    devModalHelper: {
        color: "rgba(255,255,255,0.65)",
        fontSize: 12,
        marginTop: 10,
    },

    devModalBtnRow: {
        flexDirection: "row",
        gap: 10,
    },

    devModalBtn: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 12,
        alignItems: "center",
    },

    devModalBtnGhost: {
        backgroundColor: "rgba(255,255,255,0.08)",
    },

    devModalBtnPrimary: {
        backgroundColor: "#313131",
    },

    devModalBtnText: {
        color: COLORS.white,
        fontWeight: "600",
    },

    // Optional spacers (if you want to remove inline <View style={{ height: ... }} />)
    devModalSpacer10: { height: 10 },
    devModalSpacer12: { height: 12 },
});
