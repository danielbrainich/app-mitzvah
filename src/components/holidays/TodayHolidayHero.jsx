import React from "react";
import { View, Text, Pressable } from "react-native";
import * as Haptics from "expo-haptics";
import { ui } from "../../constants/theme";

export default function TodayHolidayHero({ holiday, onAbout }) {
    if (!holiday) return null;

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 22,
            }}
        >
            <Text style={[ui.h2, ui.textWhite]}>Today is</Text>

            <Text style={[ui.h1, ui.textBrand, ui.textChutz, ui.textCenter]}>
                {holiday.title ?? ""}
            </Text>

            {holiday.hebrewTitle ? (
                <Text style={ui.todayHolidayHebrew}>{holiday.hebrewTitle}</Text>
            ) : null}

            <Pressable
                onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    onAbout?.(holiday);
                }}
                style={ui.todayHolidayMoreInfoButton}
            >
                <Text style={ui.todayHolidayMoreInfoButtonText}>
                    About this holiday
                </Text>
            </Pressable>
        </View>
    );
}
