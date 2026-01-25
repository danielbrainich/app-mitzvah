import { StyleSheet } from "react-native";
import {
    colors as tokenColors,
    spacing,
    typography,
    radii,
    layout,
} from "./design-tokens";

// Backward compatible flat colors export
export const colors = {
    bg: tokenColors.background.primary,
    card: tokenColors.background.secondary,
    white: tokenColors.text.primary,
    muted: tokenColors.text.muted,
    textPrimary: tokenColors.text.secondary,
    textBody: tokenColors.text.body,
    textMuted: tokenColors.text.muted,
    accent: tokenColors.brand.primary,
    accentBorder: tokenColors.brand.light,
    accentBg: tokenColors.brand.bg,
    success: tokenColors.semantic.success,
    error: tokenColors.semantic.error,
    pillBorder: tokenColors.border.light,
    surface2: tokenColors.background.tertiary,
};

/**
 * Navigation configuration (non-StyleSheet objects)
 */
export const nav = {
    topSpacer: { height: 48 },
    sceneContainer: { backgroundColor: tokenColors.background.primary },

    tabBarBackground: {
        flex: 1,
        backgroundColor: tokenColors.background.secondary,
        borderRadius: radii.lg,
    },

    tabBarStyle: {
        position: "absolute",
        left: 16,
        right: 16,
        bottom: 8,
        height: layout.tabBarHeight,
        borderTopWidth: 0,
        marginHorizontal: 24,
        paddingTop: 0,
        paddingBottom: 0,
    },

    tabBarItemStyle: {
        flex: 1,
        margin: 8,
        borderRadius: radii.sm,
    },

    tabBarLabelStyle: {
        fontSize: typography.size.md,
        fontWeight: typography.weight.medium,
        height: 34,
    },

    tabBarActiveBg: "#313131",
};

/**
 * Main UI Stylesheet
 */
export const ui = StyleSheet.create({
    // ===========================================
    // LAYOUT
    // ===========================================
    safeArea: {
        flex: 1,
        backgroundColor: tokenColors.background.primary,
    },

    screen: {
        paddingHorizontal: spacing[3],
    },

    scrollContent: {
        flexGrow: 1,
    },

    // ===========================================
    // TYPOGRAPHY
    // ===========================================
    textPrimary: {
        color: tokenColors.text.primary,
        fontSize: typography.size.base,
    },

    textSecondary: {
        color: tokenColors.text.secondary,
        fontSize: typography.size.base,
    },

    textMuted: {
        color: tokenColors.text.muted,
        fontSize: typography.size.base,
    },

    textMeta: {
        color: tokenColors.text.primary,
        fontSize: typography.size.sm,
    },

    paragraph: {
        color: tokenColors.text.primary,
        fontSize: typography.size.md,
        lineHeight: 22,
        marginBottom: spacing[4],
    },

    textChutz: {
        fontFamily: "ChutzBold",
    },

    // ===========================================
    // HEADINGS
    // ===========================================
    heading1: {
        color: tokenColors.brand.primary,
        fontSize: typography.size.hero,
        lineHeight: 64,
        fontWeight: typography.weight.bold,
    },

    heading2: {
        color: tokenColors.brand.primary,
        fontSize: typography.size["5xl"],
        fontWeight: typography.weight.bold,
    },

    heading3: {
        color: tokenColors.brand.primary,
        fontSize: typography.size["4xl"],
        fontWeight: typography.weight.bold,
    },

    heading4: {
        color: tokenColors.brand.primary,
        fontSize: typography.size["2xl"],
        fontWeight: typography.weight.semibold,
    },

    heading5: {
        color: tokenColors.brand.primary,
        fontSize: typography.size.xl,
        fontWeight: typography.weight.semibold,
    },

    // ===========================================
    // CARDS
    // ===========================================
    card: {
        backgroundColor: tokenColors.background.secondary,
        borderRadius: radii.lg,
        padding: spacing[7],
        marginBottom: spacing[7],
    },

    cardTitle: {
        color: tokenColors.brand.primary,
        fontSize: typography.size["4xl"],
        fontWeight: typography.weight.bold,
        marginBottom: spacing[2],
    },

    // ===========================================
    // BUTTONS
    // ===========================================
    button: {
        borderRadius: radii.md,
        paddingVertical: spacing[5],
        paddingHorizontal: spacing[6],
        alignItems: "center",
        justifyContent: "center",
    },

    buttonPrimary: {
        backgroundColor: "transparent",
        borderWidth: 0.5,
        borderColor: tokenColors.brand.primary,
    },

    buttonText: {
        fontSize: typography.size.md,
        fontWeight: typography.weight.extrabold,
        color: tokenColors.brand.primary,
    },

    iconButton: {
        width: 38,
        height: 38,
        borderRadius: radii.xl,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: tokenColors.background.secondary,
    },

    iconButtonSmall: {
        width: 36,
        height: 36,
        borderRadius: radii.xl,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: tokenColors.background.secondary,
    },

    // ===========================================
    // PILLS
    // ===========================================
    pill: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing[3],
        borderRadius: radii.xl,
        paddingVertical: spacing[3],
        paddingHorizontal: spacing[6],
        backgroundColor: tokenColors.background.tertiary,
    },

    pillText: {
        color: tokenColors.text.primary,
        fontSize: typography.size.sm,
    },

    // ===========================================
    // ROWS
    // ===========================================
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: spacing[4],
    },

    rowLeft: {
        flex: 1,
        paddingRight: spacing[5],
    },

    // ===========================================
    // DIVIDERS
    // ===========================================
    divider: {
        height: 1,
        backgroundColor: tokenColors.border.default,
        marginVertical: spacing[3],
    },

    // ===========================================
    // SHABBAT SCREEN
    // ===========================================
    shabbatHeroWrap: {
        alignItems: "center",
        paddingTop: spacing[3],
        paddingBottom: spacing[4],
    },

    shabbatCountdownCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: spacing[5],
        marginHorizontal: 72,
    },

    shabbatCountdownItem: {
        width: "33.33%",
        alignItems: "center",
    },

    shabbatCountdownNumber: {
        fontSize: 40,
        color: tokenColors.brand.primary,
        fontFamily: "ChutzBold",
    },

    shabbatCountdownLabel: {
        fontSize: typography.size.base,
        color: tokenColors.text.disabled,
        marginTop: spacing[1],
    },

    shabbatSectionHeaderRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: spacing[3],
    },

    shabbatSectionHeaderLeft: {
        color: tokenColors.brand.primary,
        fontSize: typography.size.xl,
        fontWeight: typography.weight.semibold,
    },

    shabbatSectionHeaderRight: {
        fontSize: typography.size.sm,
        color: tokenColors.text.muted,
    },

    shabbatSheetLabel: {
        color: tokenColors.text.primary,
        fontSize: typography.size.md,
    },

    shabbatSheetValue: {
        color: tokenColors.text.primary,
        fontSize: typography.size.md,
        maxWidth: "60%",
        textAlign: "right",
    },

    shabbatLocationChip: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing[3],
        paddingVertical: spacing[4],
        paddingHorizontal: spacing[5],
        borderRadius: radii.full,
        borderWidth: 1,
        borderColor: tokenColors.border.medium,
        backgroundColor: tokenColors.background.primary,
    },

    shabbatLocationChipText: {
        color: tokenColors.text.primary,
        fontSize: typography.size.sm,
    },

    shabbatGreenDot: {
        width: 10,
        height: 10,
        borderRadius: radii.full,
        backgroundColor: tokenColors.semantic.success,
    },

    shabbatSentence: {
        color: tokenColors.text.secondary,
        fontSize: typography.size.sm,
        marginBottom: spacing[6],
    },

    shabbatSentenceSmall: {
        color: tokenColors.text.secondary,
        fontSize: typography.size.md,
        lineHeight: 22,
        marginBottom: spacing[2],
    },

    shabbatParshaSmall: {
        color: tokenColors.text.muted,
        fontSize: typography.size.base,
    },

    // ===========================================
    // HOLIDAYS SCREEN
    // ===========================================
    holidaysTodaySection: {
        flexShrink: 1,
    },

    holidaysTodayPagerSlot: {
        justifyContent: "center",
        paddingTop: spacing[2],
    },

    holidaysHeaderText: {
        color: tokenColors.text.primary,
        fontSize: typography.size["5xl"],
        marginTop: spacing[8],
        marginBottom: 0,
    },

    holidaysBigBoldText: {
        color: tokenColors.brand.primary,
        fontSize: typography.size.hero,
        lineHeight: 64,
        textAlign: "center",
        marginTop: spacing[5],
        marginBottom: spacing[3],
    },

    holidaysComingUpSection: {
        marginTop: "auto",
        paddingTop: spacing[6],
    },

    holidaysSecondHeaderText: {
        color: tokenColors.text.primary,
        fontSize: typography.size.xl,
        marginBottom: spacing[6],
    },

    holidaysUpcomingCarouselContent: {
        paddingLeft: 0,
    },

    todayCarouselWrap: {
        width: "100%",
    },

    carouselDotsRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: spacing[4],
        marginBottom: spacing[1],
    },

    carouselDot: {
        backgroundColor: tokenColors.border.light,
    },

    carouselDotActive: {
        backgroundColor: "rgba(130,203,255,0.95)",
    },

    // Today Holiday Card
    todayHolidayHebrew: {
        color: tokenColors.brand.primary,
        fontSize: typography.size["2xl"],
        marginTop: 0,
    },

    todayHolidayMoreInfoButton: {
        borderRadius: radii.lg,
        padding: spacing[5],
        alignItems: "center",
        borderWidth: 0.5,
        borderColor: tokenColors.text.primary,
        backgroundColor: "transparent",
        marginVertical: spacing[8],
    },

    todayHolidayMoreInfoButtonText: {
        color: tokenColors.text.primary,
        fontSize: typography.size.sm,
        fontWeight: typography.weight.medium,
    },

    // Upcoming Holiday Card
    upcomingHolidayTitle: {
        color: tokenColors.brand.primary,
        fontSize: typography.size.xl,
        fontWeight: typography.weight.semibold,
        marginTop: spacing[2],
        marginBottom: spacing[1],
    },

    upcomingHolidayHebrew: {
        color: tokenColors.brand.primary,
        fontSize: typography.size.md,
        textAlign: "left",
        writingDirection: "rtl",
    },

    upcomingHolidayDate: {
        color: tokenColors.text.muted,
        fontSize: typography.size.base,
    },

    upcomingHolidayMoreBtnPos: {
        position: "absolute",
        top: spacing[2],
        right: spacing[5],
    },

    // ===========================================
    // SETTINGS SCREEN
    // ===========================================
    settingsTopBar: {
        height: 44,
        paddingHorizontal: spacing[6],
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
    },

    settingsScrollContent: {
        flexGrow: 1,
        paddingTop: spacing[4],
    },

    settingsRowLabel: {
        color: tokenColors.text.primary,
        fontSize: typography.size.md,
        lineHeight: 20,
    },

    settingsSubLabel: {
        color: "rgba(255,255,255,0.72)",
        fontSize: typography.size.xs,
        lineHeight: 16,
        marginTop: spacing[1],
    },

    settingsSliderBlock: {
        paddingBottom: spacing[4],
    },

    // ===========================================
    // TIP SELECTOR
    // ===========================================
    infoTiersRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: spacing[7],
        marginTop: spacing[1],
    },

    infoTierPill: {
        width: 56,
        alignItems: "center",
        borderWidth: 1,
        borderColor: tokenColors.border.light,
        borderRadius: radii.full,
        paddingVertical: spacing[3],
        backgroundColor: "transparent",
    },

    infoTierPillSelected: {
        borderColor: tokenColors.brand.light,
        backgroundColor: tokenColors.brand.bg,
    },

    infoTierText: {
        color: tokenColors.text.muted,
        fontSize: typography.size.sm,
        fontWeight: typography.weight.bold,
    },

    infoTierTextSelected: {
        color: tokenColors.brand.primary,
    },

    // ===========================================
    // BOTTOM SHEETS
    // ===========================================
    bottomSheetBg: {
        backgroundColor: tokenColors.background.secondary,
        borderTopLeftRadius: radii.lg,
        borderTopRightRadius: radii.lg,
    },

    bottomSheetHandle: {
        backgroundColor: "rgba(255,255,255,0.25)",
        width: 44,
    },

    bottomSheetContent: {
        flex: 1,
    },

    bottomSheetCloseBtn: {
        alignItems: "center",
        justifyContent: "center",
    },

    sheetTopRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingHorizontal: spacing[5],
    },

    sheetHeader: {
        paddingBottom: spacing[1],
    },

    sheetBody: {
        paddingHorizontal: spacing[7],
    },

    sheetBodyText: {
        color: tokenColors.text.primary,
        fontSize: typography.size.md,
        lineHeight: 21,
        paddingTop: spacing[1],
    },

    sheetBodyContent: {
        paddingTop: spacing[1],
    },

    sheetTitleEnglish: {
        color: tokenColors.brand.primary,
        fontSize: typography.size.xl,
        fontWeight: typography.weight.semibold,
        marginTop: spacing[2],
        marginBottom: spacing[1],
    },

    sheetTitleHebrew: {
        color: tokenColors.brand.primary,
        fontSize: typography.size.md,
        textAlign: "left",
        writingDirection: "rtl",
    },

    sheetDateInlineText: {
        color: tokenColors.text.muted,
        fontSize: typography.size.base,
    },

    // ===========================================
    // TOP BAR
    // ===========================================
    topBarSafe: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
    },

    topBarWrap: {
        height: 44,
        paddingHorizontal: spacing[6],
        justifyContent: "center",
        position: "relative",
    },

    topBarDatePressable: {
        position: "absolute",
        left: spacing[6],
        paddingVertical: spacing[2],
    },

    topBarDatePill: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing[3],
        borderRadius: radii.xl,
        paddingVertical: spacing[3],
        paddingHorizontal: spacing[6],
        backgroundColor: tokenColors.background.secondary,
    },

    topBarDateText: {
        color: tokenColors.text.primary,
        fontSize: typography.size.sm,
    },

    topBarDevDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: tokenColors.brand.primary,
        marginLeft: spacing[1],
    },

    topBarGearBtn: {
        position: "absolute",
        right: spacing[6],
    },

    topBarKebabBtn: {
        position: "absolute",
        right: spacing[6] + 38 + 10,
    },

    // ===========================================
    // DEV MODAL
    // ===========================================
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
        marginHorizontal: spacing[6],
        backgroundColor: tokenColors.background.secondary,
        borderRadius: radii.md,
        padding: spacing[6],
        borderWidth: 1,
        borderColor: tokenColors.border.default,
    },

    devModalTitle: {
        color: tokenColors.text.primary,
        fontSize: typography.size.md,
        fontWeight: typography.weight.semibold,
    },

    devModalHelper: {
        color: tokenColors.text.disabled,
        fontSize: typography.size.xs,
        marginTop: spacing[4],
    },

    devModalBtnRow: {
        flexDirection: "row",
        gap: spacing[4],
    },

    devModalBtn: {
        flex: 1,
        paddingVertical: spacing[4],
        borderRadius: radii.md,
        alignItems: "center",
    },

    devModalBtnGhost: {
        backgroundColor: tokenColors.background.tertiary,
    },

    devModalBtnPrimary: {
        backgroundColor: "#313131",
    },

    devModalBtnText: {
        color: tokenColors.text.primary,
        fontWeight: typography.weight.semibold,
    },
});
