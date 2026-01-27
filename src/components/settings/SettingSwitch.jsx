import React from "react";
import { View, Text, Platform } from "react-native";
import { Switch } from "react-native-switch";
import * as Haptics from "expo-haptics";
import { ui } from "../../constants/theme";

export default function SettingSwitch({
    label,
    sublabel,
    value,
    onValueChange,
}) {
    const handleChange = (newValue) => {
        if (Platform.OS === "ios" || Platform.OS === "android") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
                () => {}
            );
        }
        onValueChange(newValue);
    };

    return (
        <View style={ui.row}>
            <View style={ui.rowLeft}>
                <Text style={ui.paragraph}>{label}</Text>
                {sublabel && <Text style={ui.label}>{sublabel}</Text>}
            </View>

            <Switch
                value={value}
                onValueChange={handleChange}
                disabled={false}
                circleSize={26}
                barHeight={32}
                circleBorderWidth={0}
                backgroundActive="#82CBFF"
                backgroundInactive="#3e3e3e"
                circleActiveColor="#ffffff"
                circleInActiveColor="#f4f3f4"
                changeValueImmediately={true}
                renderActiveText={false}
                renderInActiveText={false}
                switchWidthMultiplier={2.2}
                switchBorderRadius={16}
            />
        </View>
    );
}
