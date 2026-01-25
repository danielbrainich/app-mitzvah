import React from "react";
import { View, Text, Pressable } from "react-native";
import * as Haptics from "expo-haptics";
import { ui } from "../../constants/theme";

export default function LocationChip({ hasLocation, onPress }) {
    return (
        <View style={{ paddingBottom: 8 }}>
            <Pressable
                onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    onPress();
                }}
                style={[ui.shabbatLocationChip, { alignSelf: "flex-start" }]}
                hitSlop={12}
            >
                <View
                    style={[
                        ui.shabbatGreenDot,
                        !hasLocation ? { backgroundColor: "#ff3b30" } : null,
                    ]}
                />
                <Text style={ui.shabbatLocationChipText}>
                    {hasLocation ? "Location on" : "Location off"}
                </Text>
            </Pressable>
        </View>
    );
}
