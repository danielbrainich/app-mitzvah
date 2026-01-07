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
    bg: "#121212",
    card: "#202020",
    white: "white",

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
    // Shabbat needs relative positioning for the floating location chip
    shabbatContainer: {
        flex: 1,
        backgroundColor: COLORS.bg,
        position: "relative",
    },
    screen: {
        paddingHorizontal: 20,
        paddingTop: 44,
        paddingBottom: 24,
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
        fontSize: 22,
        marginBottom: 10,
        fontWeight: "700",
    },

    // ---------------------------------------------------------------------------
    // Typography (shared)
    // ---------------------------------------------------------------------------
    paragraph: {
        color: COLORS.textBody,
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
        flexWrap: "wrap",
        marginBottom: 18,
        marginTop: 4,
    },

    infoTierPill: {
        borderWidth: 1,
        borderColor: COLORS.pillBorder,
        borderRadius: 999,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: "transparent",
        margin: 5,
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

    // Shared-ish text styles Shabbat uses a lot
    shabbatSentence: {
        color: "rgba(255,255,255,0.92)",
        fontSize: 18,
        lineHeight: 26,
        marginBottom: 6,
    },
    shabbatSentenceSmall: {
        color: "rgba(255,255,255,0.92)",
        fontSize: 16,
        lineHeight: 22,
        marginBottom: 6,
    },
    shabbatHighlight: {
        color: COLORS.accent,
        fontWeight: "500",
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
        color: "rgba(255,255,255,0.75)",
        fontSize: 14,
    },
    shabbatSheetValue: {
        color: COLORS.accent,
        fontSize: 14,
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

    // "Open Settings" CTA matches the old styling (not the shared primary button)
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

    // Floating location chip
    shabbatLocationChip: {
        position: "absolute",
        left: 20,
        bottom: 18,
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
        justifyContent: "flex-start",
        paddingTop: 6,
    },

    holidaysNoHolidayWrap: {
        justifyContent: "center",
        alignItems: "flex-start",
    },

    holidaysBigBoldText: {
        color: COLORS.accent,
        // NOTE: fontFamily is applied in-screen after fontsLoaded
        fontSize: 86,
        lineHeight: 90,
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
        fontFamily: "Nayuki",
        fontSize: 64,
        lineHeight: 66,
    },

    todayHolidayHebrew: {
        color: "white",
        fontSize: 26,
        opacity: 0.95,
        marginTop: 8,
    },

    todayHolidayDate: {
        color: "rgba(255,255,255,0.9)",
        fontSize: 16,
        marginTop: 12,
    },

    // This button is “card-local” (different shape than shared primaryButton)
    todayHolidayMoreInfoButton: {
        marginTop: 16,
        borderRadius: 18,
        padding: 12,
        alignItems: "center",
        borderWidth: 0.5,
        borderColor: COLORS.accent,
        backgroundColor: "transparent",
        alignSelf: "flex-start",
    },
    todayHolidayMoreInfoButtonText: {
        color: COLORS.accent,
        fontSize: 16,
        fontWeight: "700",
    },

    // Bottom sheet typography
    todayHolidayDrawerHebrew: {
        color: COLORS.accent,
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 12,
        opacity: 0.95,
    },
    todayHolidayDrawerBody: {
        color: COLORS.textBody,
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
        color: COLORS.accent,
        fontSize: 18,
        marginBottom: 6,
    },
    upcomingHolidayHebrew: {
        color: "white",
        fontSize: 16,
        marginBottom: 6,
    },
    upcomingHolidayDate: {
        color: "white",
        fontSize: 14,
        opacity: 0.75,
    },
});
