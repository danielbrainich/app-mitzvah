import React from "react";
import { View, Text } from "react-native";
import { ui } from "../../constants/theme";

export default function SettingsCard({ title, children }) {
    return (
        <View style={ui.card}>
            <Text style={[ui.h6, ui.textBrand, { marginBottom: 8 }]}>
                {title}
            </Text>
            <View style={{ gap: 12 }}>
                {children}
            </View>
        </View>
    );
}
