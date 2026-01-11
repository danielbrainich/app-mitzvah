// styles/theme.js
import { StyleSheet } from "react-native";

/**
 * Shared app styles (single stylesheet).
 *
 * Convention:
 * - Generic names = reusable across screens (container, screen, card, etc.)
 * - Screen-specific names = prefixed (info*, shabbat*, holidays*, etc.)
 */

const COLORS = {
    // Base
    bg: "black",
    card: "#131313",
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

export const ui = StyleSheet.create({
    // ---------------------------------------------------------------------------
    // Layout (shared)
    // ---------------------------------------------------------------------------
    container: {
        flex: 1,
        backgroundColor: COLORS.bg,
    },
    screen: {
        paddingHorizontal: 8,
    },

    // ---------------------------------------------------------------------------
    // Rows (shared)
    // ---------------------------------------------------------------------------
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

    // ---------------------------------------------------------------------------
    // Cards (shared)
    // ---------------------------------------------------------------------------
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

    // ---------------------------------------------------------------------------
    // Typography (shared)
    // ---------------------------------------------------------------------------
    paragraph: {
        color: "white",
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

    // ---------------------------------------------------------------------------
    // Buttons (shared)
    // ---------------------------------------------------------------------------
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

    // ---------------------------------------------------------------------------
    // Scroll helpers (shared)
    // ---------------------------------------------------------------------------
    scrollContent: {
        flexGrow: 1,
    },

    // ===========================================================================
    // INFO SCREEN (prefixed)
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
    // SHABBAT SCREEN (prefixed where appropriate)
    // ===========================================================================

    shabbatIntro: {
        color: "white",
        fontSize: 30,
        marginVertical: 16,
    },
    shabbatSentence: {
        color: "rgba(255,255,255,0.92)",
        fontSize: 14,
        marginBottom: 16,
    },
    shabbatSentenceSmall: {
        color: "rgba(255,255,255,0.92)",
        fontSize: 16,
        lineHeight: 22,
        marginBottom: 6,
    },
    shabbatMuted: {
        color: "rgba(255,255,255,0.75)",
    },

    // Footer spacing wrapper
    shabbatFooter: {
        marginTop: 4,
    },

    // Bottom sheet rows
    shabbatSheetLine: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    shabbatSheetLabel: {
        color: "white",
        fontSize: 18,
    },
    shabbatSheetValue: {
        color: "white",
        fontSize: 18,
        maxWidth: "60%",
        textAlign: "right",
    },

    // Location off notice
    shabbatLocationNotice: {
        borderRadius: 12,
        padding: 14,
        backgroundColor: "black",
    },
    shabbatLocationNoticeTitle: {
        color: "white",
        fontSize: 16,
        marginBottom: 6,
        fontWeight: "500",
    },
    shabbatLocationNoticeBody: {
        color: "white",
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
        color: "white",
        fontSize: 14,
        opacity: 0.9,
    },

    // ===========================================================================
    // SETTINGS SCREEN (prefixed)
    // ===========================================================================
    settingsRowLabel: {
        color: "white",
        fontSize: 18,
        lineHeight: 22,
    },
    settingsSubLabel: {
        color: "rgba(255,255,255,0.72)",
        fontSize: 13,
        marginTop: 6,
        lineHeight: 17,
    },

    settingsSliderBlock: {
        paddingTop: 6,
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
        fontSize: 16,
        fontWeight: "500",
    },
    settingsSliderHint: {
        color: COLORS.accent,
        fontSize: 16,
        fontWeight: "500",
    },

    // ===========================================================================
    // HOLIDAYS SCREEN (prefixed)
    // ===========================================================================
    holidaysTodaySection: {
        flexShrink: 1,
    },

    holidaysTodayPagerSlot: {
        // height is set in-screen via [style, { height: TODAY_PAGER_HEIGHT }]
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
        // NOTE: fontFamily is applied in-screen after fontsLoaded
        fontSize: 77,
        lineHeight: 74,
        textAlign: "center",
        marginTop: 12,
        marginBottom: 8,
    },

    holidaysComingUpSection: {
        marginTop: "auto",
        paddingTop: 14,
    },

    holidaysSecondHeaderText: {
        color: "white",
        fontSize: 20,
        marginBottom: 14,
    },

    holidaysUpcomingCarouselSlot: {
        // height is set in-screen via [style, { height: UPCOMING_HEIGHT }]
    },

    holidaysHeaderText: {
        color: "white",
        fontSize: 30,
        marginTop: 12,
        marginBottom: 0,
    },

    // ===========================================================================
    // TODAY HOLIDAY CARD (prefixed)
    // ===========================================================================
    todayHolidayCard: {
        backgroundColor: COLORS.card,
        borderRadius: 18,
        padding: 18,
        paddingTop: 16,
        justifyContent: "space-between",
    },

    todayHolidayHeaderText: {
        color: "white",
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
        borderColor: "white",
        backgroundColor: "transparent",
        marginVertical: 24,
    },

    todayHolidayMoreInfoButtonText: {
        color: "white",
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
        color: "white",
        fontSize: 16,
        lineHeight: 21,
    },

    // ===========================================================================
    // UPCOMING HOLIDAY CARD (prefixed)
    // ===========================================================================
    upcomingHolidayCard: {
        backgroundColor: COLORS.card,
        borderRadius: 18,
        padding: 18,
    },
    upcomingHolidayTitle: {
        fontFamily: "ChutzBold",

        color: COLORS.accent,
        fontSize: 24,
        marginBottom: 4,
        marginTop: 4,
    },
    upcomingHolidayHebrew: {
        color: colors.accent,
        fontSize: 16,
        marginBottom: 6,
    },
    upcomingHolidayDate: {
        color: "white",
        fontSize: 14,
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
        color: "white",
        fontSize: 16,
        flexShrink: 1,
        paddingRight: 10,
    },

    sheetMetaRight: {
        color: "white",
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
        color: "white",
        fontSize: 20,
        marginBottom: 14,
    },
});
