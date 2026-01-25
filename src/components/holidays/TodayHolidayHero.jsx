import React from "react";
import { View, Text, Pressable, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { ui } from "../../constants/theme";

export default function TodayHolidayHero({ holiday, onAbout }) {
    if (!holiday) return null;

    const handlePress = () => {
        if (Platform.OS === "ios" || Platform.OS === "android") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
                () => {}
            );
        }
        onAbout?.(holiday);
    };

    return (
        <View style={ui.centerContent}>
            <Text style={[ui.h2, ui.textWhite]}>Today is</Text>

            <Text style={[ui.h1, ui.textBrand, ui.textChutz, ui.textCenter]}>
                {holiday.title ?? ""}
            </Text>

            {holiday.hebrewTitle ? (
                <Text style={ui.hebrewSubtitleCard}>{holiday.hebrewTitle}</Text>
            ) : null}

            <Pressable
                onPress={handlePress}
                style={[ui.button, ui.buttonOutline]}
            >
                <Text style={ui.buttonText}>About this holiday</Text>
            </Pressable>
        </View>
    );
}
