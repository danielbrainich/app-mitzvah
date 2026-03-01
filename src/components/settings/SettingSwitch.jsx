import React from "react";
import { View, Text, Platform, Pressable } from "react-native";
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

    const isWeb = Platform.OS === "web";

    return (
        <Pressable
            onPress={() => handleChange(!value)}
            style={[
                ui.row,
                isWeb && {
                    cursor: "pointer",
                },
            ]}
        >
            <View style={ui.rowLeft}>
                <Text style={[ui.paragraph, isWeb && { fontSize: 13 }]}>
                    {label}
                </Text>
                {sublabel && (
                    <Text style={[ui.label, isWeb && { fontSize: 11 }]}>
                        {sublabel}
                    </Text>
                )}
            </View>

            <Switch
                value={value}
                onValueChange={handleChange}
                disabled={false}
                circleSize={isWeb ? 18 : 26}
                barHeight={isWeb ? 22 : 32}
                circleBorderWidth={0}
                backgroundActive="#82CBFF"
                backgroundInactive="#3e3e3e"
                circleActiveColor="#ffffff"
                circleInActiveColor="#f4f3f4"
                changeValueImmediately={true}
                renderActiveText={false}
                renderInActiveText={false}
                switchWidthMultiplier={2.2}
                switchBorderRadius={isWeb ? 11 : 16}
                style
            />
        </Pressable>
    );
}
