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

    // Surfaces
    surface2: "rgba(255,255,255,0.08)",
};

const SPACE = {
    xs: 4,
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
    "2xl": 18,
    "3xl": 24,
};

const TYPE = {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 22,
    "3xl": 24,
    header: 30,
    hero: 66,
};

const RADII = {
    sm: 12,
    md: 16,
    lg: 18,
    pill: 999,
};

export const colors = { ...COLORS };

/**
 * Non-StyleSheet config objects
 */
export const nav = {
    topSpacer: { height: 48 },
    sceneContainer: { backgroundColor: COLORS.bg },

    tabBarBackground: {
        flex: 1,
        backgroundColor: COLORS.card,
        borderRadius: RADII.lg,
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
        fontSize: TYPE.base,
        fontWeight: "500",
        height: 34,
    },

    tabBarActiveBg: "#313131",
};

/**
 * Reusable “building blocks” (plain objects) for use inside StyleSheet.
 */
const TEXT = {
    titleAccent: {
        color: COLORS.accent,
        fontFamily: "ChutzBold",
        fontSize: TYPE["2xl"],
    },
    subtitleAccent: {
        color: COLORS.accent,
        fontSize: TYPE.base,
    },
    meta: {
        color: COLORS.white,
        fontSize: TYPE.sm,
    },
    body: {
        color: COLORS.white,
        fontSize: TYPE.base,
        lineHeight: 22,
    },
};

const PILL = {
    base: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        borderRadius: 18,
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: COLORS.surface2,
    },
    text: {
        color: COLORS.white,
        fontSize: TYPE.sm,
    },
};

const CARD = {
    base: {
        backgroundColor: COLORS.card,
        borderRadius: RADII.lg,
        padding: SPACE["2xl"],
    },
};

export const ui = StyleSheet.create({
    // ===========================================================================
    // LAYOUT (shared)
    // ===========================================================================
    safeArea: { flex: 1, backgroundColor: COLORS.bg },

    screen: { paddingHorizontal: 8 },

    // ===========================================================================
    // ROWS (shared)
    // ===========================================================================
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 10,
    },
    rowLeft: { flex: 1, paddingRight: 12 },

    // ===========================================================================
    /* TYPOGRAPHY (shared) */
    // ===========================================================================
    textMeta: {
        color: COLORS.white,
        fontSize: 13,
    },

    // ===========================================================================
    // CARDS (shared)
    // ===========================================================================
    card: {
        ...CARD.base,
        marginBottom: SPACE["2xl"],
    },

    cardTitle: {
        ...TEXT.titleAccent,
        fontSize: 26,
        marginBottom: SPACE.sm,
        fontWeight: "700",
    },

    // ===========================================================================
    // TYPOGRAPHY (shared)
    // ===========================================================================
    paragraph: {
        ...TEXT.body,
        marginBottom: 10,
    },

    textChutz: { fontFamily: "ChutzBold" },

    // ===========================================================================
    // BUTTONS (shared)
    // ===========================================================================
    btn: {
        borderRadius: RADII.sm,
        paddingVertical: 12,
        alignItems: "center",
        justifyContent: "center",
    },

    btnOutline: {
        borderWidth: 0.5,
        borderColor: COLORS.accent,
        backgroundColor: "transparent",
    },

    btnText: { fontSize: TYPE.base, fontWeight: "800" },
    btnTextAccent: { color: COLORS.accent },

    // Primary button (phase out)
    primaryButton: {
        marginTop: 2,
        borderRadius: RADII.sm,
        paddingVertical: 12,
        alignItems: "center",
        borderWidth: 0.5,
        borderColor: COLORS.accent,
        backgroundColor: "transparent",
    },
    primaryButtonText: {
        color: COLORS.accent,
        fontSize: TYPE.base,
        fontWeight: "800",
    },

    // Icon buttons
    iconBtn: {
        width: 38,
        height: 38,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.card,
    },
    iconBtnSm: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.card,
    },

    // ===========================================================================
    // SHARED PILL (used for top bar pill + sheet pill + etc.)
    // ===========================================================================
    pill: { ...PILL.base },
    pillText: { ...PILL.text },

    // ===========================================================================
    // SCROLL HELPERS (shared)
    // ===========================================================================
    scrollContent: { flexGrow: 1 },

    // ===========================================================================
    // INFO SCREEN
    // ===========================================================================
    infoTiersRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: SPACE["2xl"],
        marginTop: SPACE.xs,
    },

    infoTierPill: {
        width: 56,
        alignItems: "center",
        borderWidth: 1,
        borderColor: COLORS.pillBorder,
        borderRadius: RADII.pill,
        paddingVertical: 8,
        backgroundColor: "transparent",
    },

    infoTierPillSelected: {
        borderColor: COLORS.accentBorder,
        backgroundColor: COLORS.accentBg,
    },

    infoTierText: {
        color: COLORS.textMuted,
        fontSize: TYPE.sm,
        fontWeight: "700",
    },
    infoTierTextSelected: { color: COLORS.accent },

    // ===========================================================================
    // SHABBAT SCREEN
    // ===========================================================================
    shabbatSentence: {
        color: COLORS.textPrimary,
        fontSize: TYPE.sm,
        marginBottom: SPACE.xl,
    },

    shabbatSentenceSmall: {
        color: COLORS.textPrimary,
        fontSize: TYPE.base,
        lineHeight: 22,
        marginBottom: SPACE.sm,
    },

    shabbatFooter: { marginTop: SPACE.xs },

    shabbatSheetLine: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: SPACE.lg,
    },

    shabbatSheetLabel: { color: COLORS.white, fontSize: TYPE.base },

    shabbatSheetValue: {
        color: COLORS.white,
        fontSize: TYPE.base,
        maxWidth: "60%",
        textAlign: "right",
    },

    shabbatSheetDate: {
        ...TEXT.meta,
        marginBottom: SPACE.sm,
    },

    shabbatLocationChip: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: RADII.pill,
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
        fontSize: TYPE.sm,
    },

    shabbatDateTogglePressable: { alignSelf: "flex-start", marginBottom: 10 },

    shabbatDateToggleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    shabbatDateToggleText: { color: "rgba(255,255,255,0.78)", fontSize: 14 },

    // HERO (centered title + big date)
    shabbatHeroWrap: {
        alignItems: "center",
        paddingTop: 8,
        paddingBottom: 10,
    },

    shabbatHeroTitle: {
        fontSize: 20,
        color: colors.text,
        marginBottom: 10,
    },

    // Big blue lines (reuse your brand blue if you have it; I used colors.accent if present)
    shabbatHeroMonth: {
        fontSize: 42,
        lineHeight: 44,
        color: colors.accent ?? "#82CBFF",
    },

    shabbatHeroDays: {
        fontSize: 52,
        lineHeight: 54,
        color: colors.accent ?? "#82CBFF",
        marginTop: 2,
    },

    shabbatHeroSub: {
        fontSize: 22,
        lineHeight: 26,
        color: colors.accent ?? "#82CBFF",
        marginTop: 8,
    },

    // COUNTDOWN
    shabbatCountdownCard: {
        borderRadius: 16,
        backgroundColor: colors.card,
        paddingVertical: 12,
        paddingHorizontal: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },

    shabbatCountdownItem: {
        width: "24%",
        alignItems: "center",
    },

    shabbatCountdownNumber: {
        fontSize: 22,
        color: colors.accent ?? "#82CBFF",
        fontFamily: "ChutzBold", // if you want it to match the mockup numerals
    },

    shabbatCountdownLabel: {
        fontSize: 12,
        color: colors.muted,
        marginTop: 2,
    },

    // CONSOLIDATED CARD HEADERS
    shabbatSectionHeaderRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 12,
    },

    shabbatSectionHeaderLeft: {
        fontSize: 22,
        color: colors.accent ?? "#82CBFF",
        fontFamily: "ChutzBold",
    },

    shabbatSectionHeaderRight: {
        fontSize: 13,
        color: colors.muted,
    },

    shabbatParshaLeft: {
        fontSize: 14,
        color: colors.text,
    },

    shabbatParshaRight: {
        fontSize: 14,
        color: colors.text,
    },

    shabbatSectionHeaderDatePressable: {
        alignSelf: "flex-end",
    },

    shabbatSectionHeaderDateRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },

    // ===========================================================================
    // SETTINGS SCREEN
    // ===========================================================================
    settingsTopBar: {
        height: 44,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
    },

    settingsScrollContent: { flexGrow: 1, paddingTop: 10 },

    settingsDivider: {
        height: 1,
        backgroundColor: "rgba(255,255,255,0.08)",
        marginTop: SPACE.lg,
        marginHorizontal: SPACE.lg,
    },

    settingsRowLabel: {
        color: COLORS.white,
        fontSize: TYPE.lg,
        lineHeight: 22,
    },
    settingsSubLabel: {
        color: "rgba(255,255,255,0.72)",
        fontSize: TYPE.sm,
        marginTop: SPACE.sm,
    },
    settingsSliderBlock: { paddingBottom: 10 },

    // ===========================================================================
    // HOLIDAYS SCREEN
    // ===========================================================================
    holidaysTodaySection: { flexShrink: 1 },
    holidaysTodayPagerSlot: { justifyContent: "center", paddingTop: SPACE.sm },

    holidaysBigBoldText: {
        color: COLORS.accent,
        fontSize: TYPE.hero,
        lineHeight: 64,
        textAlign: "center",
        marginTop: SPACE.lg,
        marginBottom: SPACE.md,
    },

    holidaysComingUpSection: { marginTop: "auto", paddingTop: SPACE.xl },
    holidaysSecondHeaderText: {
        color: COLORS.white,
        fontSize: TYPE.xl,
        marginBottom: SPACE.xl,
    },
    holidaysHeaderText: {
        color: COLORS.white,
        fontSize: TYPE.header,
        marginTop: SPACE.xl,
        marginBottom: 0,
    },

    carouselDotsRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        marginBottom: SPACE.xs,
    },

    carouselDot: { backgroundColor: "rgba(255,255,255,0.22)" },
    carouselDotActive: { backgroundColor: "rgba(130,203,255,0.95)" },
    todayCarouselWrap: { width: "100%" },

    // ===========================================================================
    // TODAY HOLIDAY CARD
    // ===========================================================================
    todayHolidayHebrew: {
        ...TEXT.meta,
        fontSize: TYPE["2xl"],
        marginTop: 0,
        color: COLORS.accent,
    },

    todayHolidayMoreInfoButton: {
        borderRadius: RADII.lg,
        padding: 12,
        alignItems: "center",
        borderWidth: 0.5,
        borderColor: COLORS.white,
        backgroundColor: "transparent",
        marginVertical: SPACE["3xl"],
    },

    todayHolidayMoreInfoButtonText: {
        color: COLORS.white,
        fontSize: TYPE.sm,
        fontWeight: "500",
    },

    // ===========================================================================
    // UPCOMING HOLIDAY CARD
    // ===========================================================================
    // Use shared text tokens + only keep spacing differences here.
    upcomingHolidayTitle: {
        ...TEXT.titleAccent,
        fontSize: TYPE["3xl"],
        marginTop: SPACE.sm,
        marginBottom: SPACE.xs,
    },

    upcomingHolidayHebrew: {
        ...TEXT.subtitleAccent,
        textAlign: "left",
        writingDirection: "rtl",
    },

    upcomingHolidayDate: {
        color: COLORS.muted,
        fontSize: 14,
    },

    holidaysUpcomingCarouselContent: { paddingLeft: 0 },

    upcomingHolidayMoreBtnPos: {
        position: "absolute",
        top: 6,
        right: 12,
    },

    // ===========================================================================
    // BOTTOM SHEET (shared)
    // ===========================================================================
    bottomSheetBg: {
        backgroundColor: COLORS.card,
        borderTopLeftRadius: RADII.lg,
        borderTopRightRadius: RADII.lg,
    },

    bottomSheetHandle: { backgroundColor: "rgba(255,255,255,0.25)", width: 44 },
    bottomSheetContent: { flex: 1 },

    sheetTopRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingHorizontal: 12,
    },

    bottomSheetCloseBtn: { alignItems: "center", justifyContent: "center" },

    sheetHeader: {
        paddingBottom: SPACE.xs,
    },

    sheetBody: {
        paddingHorizontal: SPACE["2xl"],
    },

    sheetBodyText: {
        ...TEXT.body,
        lineHeight: 21,
        paddingTop: SPACE.xs,
    },

    sheetTitleEnglish: {
        ...TEXT.titleAccent,
        marginTop: SPACE.sm,
        marginBottom: SPACE.xs,
    },

    sheetTitleHebrew: {
        ...TEXT.subtitleAccent,
        textAlign: "left",
        writingDirection: "rtl",
    },

    sheetDateInlinePressable: {
        alignSelf: "flex-start",
    },

    sheetDateInlineRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },

    sheetDateInlineText: {
        color: COLORS.muted,
        fontSize: 14,
    },

    sheetDivider: {
        height: 1,
        backgroundColor: "rgba(255,255,255,0.08)",
        marginVertical: 8,
    },

    // ===========================================================================
    // LOCATION SHEET
    // ===========================================================================
    locationSheetBody: {
        paddingHorizontal: 16,
        paddingBottom: 22,
    },

    locationSheetTitle: {
        ...TEXT.titleAccent,
        fontSize: TYPE.xl,
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
        ...PILL.base,
        backgroundColor: COLORS.card,
    },

    topBarDateText: { ...PILL.text },

    topBarDevDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.accent,
        marginLeft: 4,
    },

    topBarGearBtn: { position: "absolute", right: 16 },
    topBarKebabBtn: { position: "absolute", right: 16 + 38 + 10 },

    // ===========================================================================
    // DEV modal
    // ===========================================================================
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
        borderRadius: RADII.md,
        padding: 14,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.08)",
    },

    devModalTitle: {
        color: COLORS.white,
        fontSize: TYPE.base,
        fontWeight: "600",
    },
    devModalHelper: {
        color: "rgba(255,255,255,0.65)",
        fontSize: TYPE.xs,
        marginTop: 10,
    },

    devModalBtnRow: { flexDirection: "row", gap: 10 },

    devModalBtn: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: RADII.sm,
        alignItems: "center",
    },

    devModalBtnGhost: { backgroundColor: COLORS.surface2 },
    devModalBtnPrimary: { backgroundColor: "#313131" },
    devModalBtnText: { color: COLORS.white, fontWeight: "600" },
});
