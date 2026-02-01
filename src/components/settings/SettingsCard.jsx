import React from "react";
import { View, Text } from "react-native";
import { ui } from "../../constants/theme";

export default function SettingsCard({
    title,
    children,
    variant = "card", // "flat" | "card"
}) {
    const hasTitle = typeof title === "string" && title.trim().length > 0;

    return (
        <View style={[ui.card, variant === "flat" && ui.cardFlat]}>
            {hasTitle && (
                <Text style={[ui.h6, ui.textBrand, ui.mb2]}>{title}</Text>
            )}

            <View style={{ gap: 12 }}>{children}</View>
        </View>
    );
}
