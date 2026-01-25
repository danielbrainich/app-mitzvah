import React from "react";
import { View, Text } from "react-native";
import { ui } from "../../constants/theme";

export default function SettingsCard({ title, children }) {
    return (
        <View style={ui.card}>
            <Text style={ui.cardTitle}>{title}</Text>
            {children}
        </View>
    );
}
