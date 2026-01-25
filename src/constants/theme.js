import { StyleSheet } from "react-native";
import {
    colors as tokenColors,
    spacing,
    typography,
    radii,
    layout,
} from "./design-tokens";

/**
 * Backward compatible flat colors export
 */
export const colors = {
    bg: tokenColors.background.primary,
    card: tokenColors.background.secondary,
    white: tokenColors.text.primary,
    muted: tokenColors.text.muted,
    textPrimary: tokenColors.text.secondary,
    textBody: tokenColors.text.body,
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
    // ==========================================
    // LAYOUT
    // ==========================================
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

    container: {
        flex: 1,
        width: "100%",
        maxWidth: layout.maxWidth,
    },

    // ==========================================
    // ROWS & COLUMNS
    // ==========================================
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    rowLeft: {
        flex: 1,
        paddingRight: spacing[5],
    },

    // ==========================================
    // TYPOGRAPHY - Headings
    // ==========================================
    h1: {
        fontSize: typography.size.hero,
        lineHeight: 64,
        fontWeight: typography.weight.bold,
    },

    h2: {
        fontSize: typography.size["5xl"],
        fontWeight: typography.weight.bold,
    },

    h3: {
        fontSize: typography.size["4xl"],
        fontWeight: typography.weight.bold,
    },

    h4: {
        fontSize: typography.size["2xl"],
        fontWeight: typography.weight.semibold,
    },

    h5: {
        fontSize: typography.size.xl,
        fontWeight: typography.weight.semibold,
    },

    h6: {
        fontSize: typography.size.lg,
        fontWeight: typography.weight.semibold,
    },

    // Typography - Body Text Sizes
    textBody: {
        fontSize: typography.size.md,
        lineHeight: 22,
    },

    textBase: {
        fontSize: typography.size.base,
        lineHeight: 20,
    },

    textSmall: {
        fontSize: typography.size.sm,
    },

    textXs: {
        fontSize: typography.size.xs,
    },

    // Typography - Colors
    textBrand: {
        color: tokenColors.brand.primary,
    },

    textWhite: {
        color: tokenColors.text.primary,
    },

    textSecondary: {
        color: tokenColors.text.secondary,
    },

    // Typography - Variants
    textCenter: {
        textAlign: "center",
    },

    textChutz: {
        fontFamily: "ChutzBold",
    },

    textHebrew: {
        writingDirection: "rtl",
        textAlign: "right",
    },

    paragraph: {
        color: tokenColors.text.primary,
        fontSize: typography.size.md,
        lineHeight: 22,
    },

    textWithMargin: {
        marginBottom: spacing[3],
    },

    label: {
        fontSize: typography.size.base,
        color: tokenColors.text.muted,
        marginTop: spacing[1],
        marginBottom: spacing[1],
    },

    // ==========================================
    // SPACING UTILITIES
    // ==========================================
    mb1: { marginBottom: spacing[1] },
    mb2: { marginBottom: spacing[2] },
    mb3: { marginBottom: spacing[3] },
    mb4: { marginBottom: spacing[4] },
    mb5: { marginBottom: spacing[5] },
    mb6: { marginBottom: spacing[6] },

    mt1: { marginTop: spacing[1] },
    mt2: { marginTop: spacing[2] },
    mt3: { marginTop: spacing[3] },
    mt5: { marginTop: spacing[5] },
    mt8: { marginTop: spacing[8] },

    // ==========================================
    // CARDS
    // ==========================================
    card: {
        backgroundColor: tokenColors.background.secondary,
        borderRadius: radii.lg,
        padding: spacing[7],
        marginBottom: spacing[7],
    },

    // ==========================================
    // BUTTONS
    // ==========================================
    button: {
        borderRadius: radii.md,
        paddingVertical: spacing[5],
        paddingHorizontal: spacing[6],
        alignItems: "center",
        justifyContent: "center",
    },

    buttonOutline: {
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

    // ==========================================
    // PILLS & CHIPS
    // ==========================================
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

    chip: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing[3],
        paddingVertical: spacing[4],
        paddingHorizontal: spacing[5],
        borderRadius: radii.full,
        borderWidth: 1,
        borderColor: tokenColors.border.medium,
    },

    // ==========================================
    // DIVIDERS
    // ==========================================
    divider: {
        height: 1,
        backgroundColor: tokenColors.border.default,
        marginVertical: spacing[3],
    },

    // ==========================================
    // STATUS INDICATORS
    // ==========================================
    dotSuccess: {
        width: 10,
        height: 10,
        borderRadius: radii.full,
        backgroundColor: tokenColors.semantic.success,
    },

    dotError: {
        width: 10,
        height: 10,
        borderRadius: radii.full,
        backgroundColor: tokenColors.semantic.error,
    },

    // ==========================================
    // SHABBAT SCREEN (truly unique styles only)
    // ==========================================
    shabbatHeroWrap: {
        alignItems: "center",
        paddingTop: spacing[3],
        paddingBottom: spacing[4],
    },

    shabbatCountdownCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: spacing[5],
        marginHorizontal: 80,
    },

    shabbatCountdownItem: {
        width: "33.33%",
        alignItems: "center",
    },

    shabbatCountdownNumber: {
        fontSize: 44,
        color: tokenColors.brand.primary,
        fontFamily: "ChutzBold",
    },

    // ==========================================
    // HOLIDAYS SCREEN (truly unique styles only)
    // ==========================================
    holidaysTodaySection: {
        flexShrink: 1,
    },

    holidaysTodayPagerSlot: {
        justifyContent: "center",
        paddingTop: spacing[2],
    },

    holidaysComingUpSection: {
        marginTop: "auto",
        paddingTop: spacing[6],
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

    upcomingHolidayMoreBtnPos: {
        position: "absolute",
        top: spacing[2],
        right: spacing[5],
    },

    // ==========================================
    // SETTINGS SCREEN
    // ==========================================
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

    // ==========================================
    // TIP SELECTOR
    // ==========================================
    tipTiersRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: spacing[7],
        marginTop: spacing[1],
    },

    tipPill: {
        width: 56,
        alignItems: "center",
        borderWidth: 1,
        borderColor: tokenColors.border.light,
        borderRadius: radii.full,
        paddingVertical: spacing[3],
        backgroundColor: "transparent",
    },

    tipPillSelected: {
        borderColor: tokenColors.brand.light,
        backgroundColor: tokenColors.brand.bg,
    },

    tipText: {
        color: tokenColors.text.muted,
        fontSize: typography.size.sm,
        fontWeight: typography.weight.bold,
    },

    tipTextSelected: {
        color: tokenColors.brand.primary,
    },

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

    // ==========================================
    // BOTTOM SHEETS
    // ==========================================
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

    // ==========================================
    // TOP BAR
    // ==========================================
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

    // ==========================================
    // DEV MODAL
    // ==========================================
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
});
