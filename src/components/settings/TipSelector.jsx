import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import * as Haptics from "expo-haptics";
import { ui } from "../../constants/theme";

const TIP_AMOUNTS = [1, 2, 5, 10, 18];

export default function TipSelector({ selectedAmount, onAmountChange }) {
    return (
        <View style={ui.infoTiersRow}>
            {TIP_AMOUNTS.map((amount) => {
                const selected = amount === selectedAmount;
                return (
                    <TouchableOpacity
                        key={amount}
                        onPress={() => {
                            onAmountChange(amount);
                            Haptics.impactAsync(
                                Haptics.ImpactFeedbackStyle.Light
                            );
                        }}
                        activeOpacity={0.85}
                        style={[
                            ui.infoTierPill,
                            selected ? ui.infoTierPillSelected : null,
                        ]}
                    >
                        <Text
                            style={[
                                ui.infoTierText,
                                selected ? ui.infoTierTextSelected : null,
                            ]}
                        >
                            ${amount}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}
