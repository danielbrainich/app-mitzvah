import React from "react";
import { View, Text, Switch } from "react-native";
import { ui } from "../../constants/theme";

export default function SettingSwitch({
    label,
    sublabel,
    value,
    onValueChange,
}) {
    return (
        <View style={ui.settingsRow}>
            <View style={ui.rowLeft}>
                <Text style={ui.settingsRowLabel}>{label}</Text>
                {sublabel && (
                    <Text style={ui.settingsSubLabel}>{sublabel}</Text>
                )}
            </View>

            <Switch
                trackColor={{
                    false: "#767577",
                    true: "#82CBFF",
                }}
                thumbColor="#f4f3f4"
                ios_backgroundColor="#3e3e3e"
                onValueChange={onValueChange}
                value={value}
            />
        </View>
    );
}
