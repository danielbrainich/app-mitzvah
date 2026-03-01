import React from "react";
import { View, Platform, StyleSheet } from "react-native";
import { colors, layout } from "../../constants/design-tokens";

/**
 * WebLayout
 * On web: centers content in a max-width container with subtle side borders,
 * mimicking a mobile frame so the app looks intentional on desktop.
 * On native: renders children as-is with no overhead.
 */
export default function WebLayout({ children }) {
    if (Platform.OS !== "web") {
        return <>{children}</>;
    }

    return (
        <View style={styles.webRoot}>
            <View style={styles.webFrame}>{children}</View>
        </View>
    );
}

const styles = StyleSheet.create({
    webRoot: {
        flex: 1,
        backgroundColor: "#111111",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    webFrame: {
        flex: 1,
        width: "100%",
        maxWidth: layout.maxWidth,
        backgroundColor: colors.background.primary,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: "rgba(255,255,255,0.08)",
        overflow: "hidden",
    },
});
