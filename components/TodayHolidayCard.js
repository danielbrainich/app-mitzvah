import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { getHolidayDetailsByName } from "../utils/getHolidayDetails";

function removeParentheses(text) {
    return (text || "").replace(/\s*\([^)]*\)/g, "");
}

export default function TodayHolidayCard({ holiday, dateDisplay, cardWidth }) {
    const details = getHolidayDetailsByName(holiday?.title);

    return (
        <View style={[styles.card, cardWidth ? { width: cardWidth } : null]}>
            <Text style={styles.title}>
                {removeParentheses(holiday?.title)}
            </Text>

            {!!holiday?.hebrewTitle && (
                <Text style={styles.hebrew}>{holiday.hebrewTitle}</Text>
            )}

            <Text style={styles.date}>
                {dateDisplay === "gregorian"
                    ? holiday?.date
                    : holiday?.hebrewDate}
            </Text>

            {!!details?.description && (
                <Text style={styles.description}>{details.description}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#0b1220",
        borderRadius: 20,
        padding: 22,
        borderWidth: 1,
        borderColor: "rgba(130,203,255,0.35)",
    },
    title: {
        color: "#82CBFF",
        fontFamily: "Nayuki",
        fontSize: 48,
        marginBottom: 8,
    },
    hebrew: {
        color: "#82CBFF",
        fontSize: 28,
        marginBottom: 8,
    },
    date: {
        color: "white",
        fontSize: 14,
        opacity: 0.8,
    },
    description: {
        color: "white",
        opacity: 0.9,
        fontSize: 15,
        lineHeight: 20,
        marginTop: 14,
    },
});
