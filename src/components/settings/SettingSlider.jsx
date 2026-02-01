import React from "react";
import { View } from "react-native";
import { Slider } from "@miblanchard/react-native-slider";
import * as Haptics from "expo-haptics";
import { ui } from "../../constants/theme";

export default function SettingSlider({
    value,
    minimumValue = 0,
    maximumValue = 60,
    onValueChange,
    showDivider = false,
}) {
    const handleValueChange = (values) => {
        const newValue = Array.isArray(values) ? values[0] : values;
        onValueChange(newValue);
    };

    const handleSlidingComplete = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    };

    return (
        <View style={{ paddingHorizontal: 8 }}>
            <Slider
                value={value}
                onValueChange={handleValueChange}
                onSlidingComplete={handleSlidingComplete}
                minimumValue={minimumValue}
                maximumValue={maximumValue}
                step={1}
                minimumTrackTintColor="#82CBFF"
                maximumTrackTintColor="#3e3e3e"
                thumbTintColor="#ffffff"
                trackStyle={{ height: 4, borderRadius: 2 }}
                thumbStyle={{
                    height: 26,
                    width: 26,
                    borderRadius: 13,
                    backgroundColor: "#ffffff",
                }}
            />
            {showDivider && <View style={ui.divider} />}
        </View>
    );
}
