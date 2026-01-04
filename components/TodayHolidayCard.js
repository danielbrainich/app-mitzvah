import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { getHolidayDetailsByName } from "../utils/getHolidayDetails";
import { HDate } from "@hebcal/core";
import BottomSheetDrawer from "./BottomSheetDrawer";

function removeParentheses(text) {
    return (text || "").replace(/\s*\([^)]*\)/g, "");
}

export default function TodayHolidayCard({
    holiday,
    dateDisplay,
    cardWidth,
    todayIso,
    formatDate,
}) {
    const [open, setOpen] = useState(false);

    const todayLabel =
        dateDisplay === "gregorian"
            ? formatDate(todayIso)
            : new HDate().toString();

    const details = useMemo(
        () => getHolidayDetailsByName(holiday?.title),
        [holiday?.title]
    );

    const title = removeParentheses(holiday?.title);
    const description = details?.description || "";
    const hasDescription = Boolean(description);

    return (
        <View style={[styles.wrap, cardWidth ? { width: cardWidth } : null]}>
            <View style={styles.titleRow}>
                <Text style={styles.title}>{title}</Text>

                {hasDescription ? (
                    <Pressable
                        onPress={() => setOpen(true)}
                        hitSlop={12}
                        style={styles.infoButton}
                        accessibilityRole="button"
                        accessibilityLabel="More info"
                    >
                        <Text style={styles.infoIcon}>hellooo</Text>
                    </Pressable>
                ) : null}
            </View>
            {!!holiday?.hebrewTitle && (
                <Text style={styles.hebrew}>{holiday.hebrewTitle}</Text>
            )}

            <Text style={styles.todayDate}>{todayLabel}</Text>

            <BottomSheetDrawer
                visible={open}
                onClose={() => setOpen(false)}
                title={title}
                snapPoints={["45%", "75%"]}
            >
                {!!holiday?.hebrewTitle && (
                    <Text style={styles.drawerHebrew}>
                        {holiday.hebrewTitle}
                    </Text>
                )}

                <Text style={styles.drawerBody}>{description}</Text>
            </BottomSheetDrawer>
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: {
        paddingVertical: 6,
    },

    titleRow: {
        position: "relative",
        flexDirection: "row",
        alignItems: "flex-start",
    },

    title: {
        flex: 1,
        paddingRight: 34, // reserve space for the icon
        color: "#82CBFF",
        fontFamily: "Nayuki",
        fontSize: 64,
        lineHeight: 66,
    },

    infoButton: {
        position: "absolute",
        top: 6,
        right: 0,
        padding: 8,
        zIndex: 20,
    },

    infoIcon: {
        color: "white",
        opacity: 0.9,
        fontSize: 18,
        fontWeight: "800",
    },

    hebrew: {
        color: "white",
        fontSize: 26,
        opacity: 0.95,
        marginTop: 8,
        marginBottom: 10,
    },

    todayDate: {
        color: "rgba(255,255,255,0.9)",
        fontSize: 16,
        marginBottom: 10,
    },

    drawerHebrew: {
        color: "#82CBFF",
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 12,
        opacity: 0.95,
    },
    drawerBody: {
        color: "rgba(255,255,255,0.88)",
        fontSize: 16,
        lineHeight: 21,
    },
});
