import React, { useMemo } from "react";
import { View, Text } from "react-native";
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
    formatDate,
}) {
    const title = stripParentheses(holiday?.title);

    // Use the HOLIDAY’s date
    const gregLabel = useMemo(() => {
        if (!holiday?.date) return "";
        return formatDate(holiday.date);
    }, [holiday?.date, formatDate]);

    // Hebrew label also needs the HOLIDAY’s date, and it must be a Date object
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
        </View>
    );
}
