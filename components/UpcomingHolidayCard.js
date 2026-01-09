import React, { useMemo } from "react";
import { View, Text, Pressable } from "react-native";
import { HDate } from "@hebcal/core";
import { parseLocalIso } from "../utils/datetime";
import { ui } from "../styles/theme";

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
    onAbout, // ✅ new
}) {
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

    return (
        <View
            style={[
                ui.upcomingHolidayCard,
                cardWidth ? { width: cardWidth } : null,
            ]}
        >
            <Text style={ui.upcomingHolidayTitle}>{title}</Text>

            {!!holiday?.hebrewTitle && (
                <Text style={ui.upcomingHolidayHebrew}>
                    {holiday.hebrewTitle}
                </Text>
            )}

            <Text style={ui.upcomingHolidayDate}>
                {hebrewDate ? hebLabel : gregLabel}
            </Text>

            {/* About button (only if handler exists) */}
            {onAbout && (
                <Pressable onPress={() => onAbout(holiday)} hitSlop={10}>
                    <Text style={ui.holidayAboutLink}>About this holiday</Text>
                </Pressable>
            )}
        </View>
    );
}
