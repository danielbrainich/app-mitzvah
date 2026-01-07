import React, { useMemo, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { HDate } from "@hebcal/core";

import { ui } from "../styles/theme";
import { getHolidayDetailsByName } from "../utils/getHolidayDetails";
import BottomSheetDrawer from "./BottomSheetDrawer";

/**
 * Removes any parenthetical suffix from a holiday title.
 * Example: "Sukkot (CH''M)" -> "Sukkot"
 * Use this for the big display title so it stays clean.
 */
function stripParentheses(text) {
    return (text || "").replace(/\s*\([^)]*\)/g, "");
}

export default function TodayHolidayCard({
    holiday,
    cardWidth,
    cardHeight,
    todayIso,
    formatDate,
    hebrewDate,
}) {
    const [open, setOpen] = useState(false);

    const todayLabel = !hebrewDate
        ? formatDate(todayIso)
        : new HDate().toString();

    const details = useMemo(
        () => getHolidayDetailsByName(holiday?.title),
        [holiday?.title]
    );

    const title = stripParentheses(holiday?.title);
    const description = details?.description || "";
    const hasDescription = Boolean(description);

    return (
        <View
            style={[
                ui.todayHolidayCard,
                { width: cardWidth, height: cardHeight },
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
                        onPress={() => setOpen(true)}
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

            <Text style={ui.todayHolidayDate} numberOfLines={1}>
                {todayLabel}
            </Text>

            <BottomSheetDrawer
                visible={open}
                onClose={() => setOpen(false)}
                title={title}
                snapPoints={["45%", "55%"]}
            >
                {!!holiday?.hebrewTitle && (
                    <Text style={ui.todayHolidayDrawerHebrew}>
                        {holiday.hebrewTitle}
                    </Text>
                )}
                <Text style={ui.todayHolidayDrawerBody}>{description}</Text>
            </BottomSheetDrawer>
        </View>
    );
}
