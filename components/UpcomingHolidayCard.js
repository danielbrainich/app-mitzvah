import React, { useMemo, useState, useCallback } from "react";
import { View, Text, Pressable } from "react-native";
import { HDate } from "@hebcal/core";
import { parseLocalIso } from "../utils/datetime";
import { ui } from "../styles/theme";
import { useFonts } from "expo-font";
import * as Haptics from "expo-haptics";
import { Entypo } from "@expo/vector-icons";

/**
 * Removes any parenthetical suffix from a holiday title.
 * Example: "Sukkot (CH''M)" -> "Sukkot"
 */
function stripParentheses(text) {
    return (text || "").replace(/\s*\([^)]*\)/g, "");
}

export default function UpcomingHolidayCard({
    holiday,
    hebrewDate,
    cardWidth,
    onAbout,
}) {
    const [fontsLoaded] = useFonts({
        ChutzBold: require("../assets/fonts/Chutz-Bold.otf"),
    });

    const title = stripParentheses(holiday?.title);

    // Gregorian label for THIS holiday
    const gregLabel = useMemo(() => {
        if (!holiday?.date) return "";
        return holiday.date;
    }, [holiday?.date]);

    // Hebrew label for THIS holiday
    const hebLabel = useMemo(() => {
        const d = parseLocalIso(holiday?.date);
        if (!d) return "";
        return new HDate(d).toString();
    }, [holiday?.date]);

    const onPressDots = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onAbout?.(holiday);
    }, [onAbout, holiday]);

    return (
        <View
            style={[
                ui.upcomingHolidayCard,
                cardWidth ? { width: cardWidth } : null,
                { position: "relative" },
            ]}
        >
            <Text
                style={[ui.upcomingHolidayTitle, { fontFamily: "ChutzBold" }]}
            >
                {title}
            </Text>

            {!!holiday?.hebrewTitle && (
                <Text style={ui.upcomingHolidayHebrew}>
                    {holiday.hebrewTitle},
                </Text>
            )}

            <Text style={ui.upcomingHolidayDate}>
                {hebrewDate ? hebLabel : gregLabel}
            </Text>

            {/* About button (only if handler exists) */}
            {/* Three dots (only if handler exists) */}
            {onAbout ? (
                <Pressable
                    onPress={onPressDots}
                    hitSlop={12}
                    style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    accessibilityRole="button"
                    accessibilityLabel="More options"
                >
                    <Entypo
                        name="dots-three-vertical"
                        size={16}
                        color="#fff"
                    />
                </Pressable>
            ) : null}
        </View>
    );
}
