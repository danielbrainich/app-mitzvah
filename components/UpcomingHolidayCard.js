import React, { useMemo, useCallback } from "react";
import { View, Text, Pressable } from "react-native";
import { HDate } from "@hebcal/core";
import {
    parseLocalIso,
    formatGregorianLongFromIso,
} from "../utils/datetime";
import { ui } from "../styles/theme";
import * as Haptics from "expo-haptics";
import { Entypo } from "@expo/vector-icons";

function stripParentheses(text) {
    return (text || "").replace(/\s*\([^)]*\)/g, "");
}

export default function UpcomingHolidayCard({
    holiday,
    hebrewDate,
    cardWidth,
    onAbout,
}) {
    const title = stripParentheses(holiday?.title);

    const gregLabel = useMemo(() => {
        if (!holiday?.date) return "";
        return formatGregorianLongFromIso(holiday.date);
    }, [holiday?.date]);

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
            <Text style={ui.upcomingHolidayDate}>
                {hebrewDate ? hebLabel : gregLabel}
            </Text>

            <Text style={ui.upcomingHolidayTitle}>{title}</Text>

            {!!holiday?.hebrewTitle && (
                <Text style={ui.upcomingHolidayHebrew}>
                    {holiday.hebrewTitle}
                </Text>
            )}

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
                    <Entypo name="dots-three-vertical" size={16} color="white" />
                </Pressable>
            ) : null}
        </View>
    );
}
