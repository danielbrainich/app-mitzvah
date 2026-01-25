import React from "react";
import { View } from "react-native";
import Slider from "@react-native-community/slider";
import { ui } from "../../constants/theme";

export default function SettingSlider({
    value,
    minimumValue = 0,
    maximumValue = 60,
    onValueChange,
    showDivider = false,
}) {
    return (
        <View>
            <Slider
                value={value}
                minimumValue={minimumValue}
                maximumValue={maximumValue}
                step={1}
                minimumTrackTintColor="#82CBFF"
                maximumTrackTintColor="rgba(255,255,255,0.25)"
                thumbTintColor="#f4f3f4"
                onValueChange={onValueChange}
            />
            {showDivider && <View style={ui.divider} />}
        </View>
    );
}
