import React from "react";
import { View, Text } from "react-native";
import { HDate } from "@hebcal/core";

import { ui } from "../styles/theme";

/**
 * Removes any parenthetical suffix from a holiday title.
 * Example: "Sukkot (CH''M)" -> "Sukkot"
 */
function stripParentheses(text) {
    return (text || "").replace(/\s*\([^)]*\)/g, "");
}

/**
 * Parse YYYY-MM-DD as a LOCAL Date (avoids timezone shifting).
 * Use this before passing to HDate (HDate does not accept ISO strings directly).
 */
function parseLocalIso(iso) {
    if (!iso) return null;
    const [y, m, d] = String(iso).split("-").map(Number);
    if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d))
        return null;
    return new Date(y, m - 1, d, 0, 0, 0, 0);
}

export default function UpcomingHolidayCard({
    holiday,
    hebrewDate,
    cardWidth,
    formatDate,
}) {
    const iso = holiday?.date; // expected: YYYY-MM-DD
    const localDate = parseLocalIso(iso);

    return (
        <View
            style={[
                ui.upcomingHolidayCard,
                cardWidth ? { width: cardWidth } : null,
            ]}
        >
            <Text style={ui.upcomingHolidayTitle}>
                {stripParentheses(holiday?.title)}
            </Text>

            {!!holiday?.hebrewTitle && (
                <Text style={ui.upcomingHolidayHebrew}>
                    {holiday.hebrewTitle}
                </Text>
            )}

            <Text style={ui.upcomingHolidayDate}>
                {!hebrewDate
                    ? formatDate(iso)
                    : localDate
                    ? new HDate(localDate).toString()
                    : ""}
            </Text>
        </View>
    );
}
