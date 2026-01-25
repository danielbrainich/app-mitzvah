/**
 * Design Tokens - The foundation of our design system
 * These are the primitive values that everything else is built from
 */

export const colors = {
    // Background
    background: {
        primary: "black",
        secondary: "#1A1A1A",
        tertiary: "rgba(255,255,255,0.08)",
    },

    // Text
    text: {
        primary: "white",
        secondary: "rgba(255,255,255,0.92)",
        body: "rgba(255,255,255,0.88)",
        muted: "rgba(255,255,255,0.78)",
        disabled: "rgba(255,255,255,0.65)",
    },

    // Brand
    brand: {
        primary: "#82CBFF",
        light: "rgba(130,203,255,0.65)",
        bg: "rgba(130,203,255,0.14)",
    },

    // Semantic
    semantic: {
        success: "#35D07F",
        error: "#ff3b30",
        warning: "#FFD60A",
    },

    // Borders
    border: {
        default: "rgba(255,255,255,0.08)",
        medium: "rgba(255,255,255,0.18)",
        light: "rgba(255,255,255,0.22)",
    },
};

export const spacing = {
    0: 0,
    1: 4,
    2: 6,
    3: 8,
    4: 10,
    5: 12,
    6: 16,
    7: 18,
    8: 24,
    9: 32,
    10: 40,
    12: 48,
    16: 64,
    20: 80,
};

export const typography = {
    size: {
        xs: 12,
        sm: 13,
        base: 14,
        md: 16,
        lg: 18,
        xl: 20,
        "2xl": 22,
        "3xl": 24,
        "4xl": 26,
        "5xl": 30,
        "6xl": 42,
        "7xl": 52,
        hero: 66,
    },

    weight: {
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
    },

    lineHeight: {
        tight: 1.25,
        snug: 1.375,
        normal: 1.5,
        relaxed: 1.625,
    },
};

export const radii = {
    sm: 10,
    md: 12,
    lg: 16,
    xl: 18,
    full: 999,
};

export const layout = {
    maxWidth: 520,
    tabBarHeight: 64,
};

// Backward compatibility - flat color object (MUST come after colors is defined)
export const colorsFlat = {
    // Background
    bg: colors.background.primary,
    card: colors.background.secondary,

    // Text
    white: colors.text.primary,
    muted: colors.text.muted,
    textPrimary: colors.text.secondary,
    textBody: colors.text.body,

    // Brand
    accent: colors.brand.primary,
    accentBorder: colors.brand.light,
    accentBg: colors.brand.bg,

    // Semantic
    success: colors.semantic.success,
    error: colors.semantic.error,

    // Borders
    pillBorder: colors.border.light,

    // Surfaces
    surface2: colors.background.tertiary,
};
