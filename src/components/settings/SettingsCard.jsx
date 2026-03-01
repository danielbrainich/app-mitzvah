import React from "react";
import { View, Text, Platform } from "react-native";
import { ui } from "../../constants/theme";

export default function SettingsCard({
    title,
    children,
    variant = "card",
}) {
    const hasTitle = typeof title === "string" && title.trim().length > 0;
    const isWeb = Platform.OS === "web";

    return (
        <View style={[ui.card, variant === "flat" && ui.cardFlat]}>
            {hasTitle && (
                <Text
                    style={[
                        ui.h6,
                        ui.textBrand,
                        ui.mb2,
                        isWeb && { marginBottom: 6 }
                    ]}
                >
                    {title}
                </Text>
            )}

            <View
                style={{
                    gap: isWeb ? 6 : 12
                }}
            >
                {children}
            </View>
        </View>
    );
}
