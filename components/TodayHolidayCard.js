import React, { useMemo } from "react";
import { View, Text, Pressable } from "react-native";
import { HDate } from "@hebcal/core";

import { ui } from "../styles/theme";
import { getHolidayDetailsByName } from "../utils/getHolidayDetails";

/**
 * Removes any parenthetical suffix from a holiday title.
 * Example: "Sukkot (CH''M)" -> "Sukkot"
 */
function stripParentheses(text) {
    return (text || "").replace(/\s*\([^)]*\)/g, "");
}

/**
 * NOTE:
 * This component is now "dumb":
 * - It renders the card.
 * - It does NOT own the bottom sheet.
 * - It asks the parent to open the sheet via onAbout(holiday).
 */
export default function TodayHolidayCard({
    holiday,
    cardWidth,
    cardHeight,
    todayIso,
    formatDate,
    hebrewDate,
    onAbout, // ✅ parent-owned drawer handler
}) {
    const title = stripParentheses(holiday?.title);

    const details = useMemo(
        () => getHolidayDetailsByName(holiday?.title),
        [holiday?.title]
    );

    const description = details?.description || "";
    const hasDescription = Boolean(description);

    // If you're not showing date here anymore, you can delete this block + the Text below.
    const todayLabel = useMemo(() => {
        if (!todayIso) return "";
        if (!hebrewDate) return formatDate?.(todayIso) ?? "";
        // If you ever re-enable hebrew date display, use todayIso's date:
        // new HDate(parseLocalIso(todayIso)).toString()
        return new HDate().toString();
    }, [todayIso, hebrewDate, formatDate]);

    return (
        <View
            style={[
                ui.todayHolidayCard,
                cardWidth ? { width: cardWidth } : null,
                cardHeight ? { height: cardHeight } : null,
            ]}
        >
            <View>
                <Text style={ui.todayHolidayHeaderText}>Today is</Text>

                <View style={ui.todayHolidayTitleRow}>
                    <Text
                        style={ui.todayHolidayTitle}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                    >
                        {title}
                    </Text>
                </View>

                {!!holiday?.hebrewTitle && (
                    <Text
                        style={ui.todayHolidayHebrew}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {holiday.hebrewTitle}
                    </Text>
                )}

                {hasDescription ? (
                    <Pressable
                        onPress={() => onAbout?.(holiday)}
                        hitSlop={12}
                        accessibilityRole="button"
                        accessibilityLabel="More info"
                        style={ui.todayHolidayMoreInfoButton}
                    >
                        <Text style={ui.todayHolidayMoreInfoButtonText}>
                            More info
                        </Text>
                    </Pressable>
                ) : null}
            </View>

            {!!todayLabel && (
                <Text style={ui.todayHolidayDate} numberOfLines={1}>
                    {todayLabel}
                </Text>
            )}
        </View>
    );
}
