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

    const title = removeParentheses(holiday?.title);
    const description = details?.description || "";
    const hasDescription = Boolean(description);

    return (
        <View style={[styles.card, { width: cardWidth, height: cardHeight }]}>
            <View style={styles.top}>
                <Text style={styles.headerText}>Today is</Text>

                <View style={styles.titleRow}>
                    <Text
                        style={styles.title}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                    >
                        {title}
                    </Text>
                </View>
                {!!holiday?.hebrewTitle && (
                    <Text
                        style={styles.hebrew}
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
                        style={styles.primaryButton}
                    >
                        <Text style={styles.primaryButtonText}>More info</Text>
                    </Pressable>
                ) : null}
            </View>

            <Text style={styles.todayDate} numberOfLines={1}>
                {todayLabel}
            </Text>

            <BottomSheetDrawer
                visible={open}
                onClose={() => setOpen(false)}
                title={title}
                snapPoints={["45%", "55%"]}
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
    card: {
        backgroundColor: "#202020",
        borderRadius: 18,
        padding: 18,
        paddingTop: 16,
        justifyContent: "space-between",
    },

    top: {
        // keeps title + hebrew grouped at top
    },

    titleRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 10,
    },

    title: {
        flex: 1,
        color: "#82CBFF",
        fontFamily: "Nayuki",
        fontSize: 64,
        lineHeight: 66,
    },

    primaryButton: {
        marginTop: 16,
        borderRadius: 18,
        padding: 12,
        alignItems: "center",
        borderWidth: 0.5,
        borderColor: "#82CBFF",
        backgroundColor: "transparent",
        alignSelf: "flex-start",
    },
    primaryButtonText: {
        color: "#82CBFF",
        fontSize: 16,
        fontWeight: "700",
    },

    hebrew: {
        color: "white",
        fontSize: 26,
        opacity: 0.95,
        marginTop: 8,
    },

    todayDate: {
        color: "rgba(255,255,255,0.9)",
        fontSize: 16,
        marginTop: 12,
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
    headerText: {
        color: "white",
        fontSize: 30,
        marginTop: 0,
        marginBottom: 12,
    },
});
