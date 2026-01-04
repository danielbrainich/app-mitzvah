import React from "react";
import { View, Text, StyleSheet } from "react-native";

function removeParentheses(text) {
    return (text || "").replace(/\s*\([^)]*\)/g, "");
}

export default function UpcomingHolidayCard({
    holiday,
    dateDisplay,
    cardWidth,
}) {
    return (
        <View style={[styles.card, cardWidth ? { width: cardWidth } : null]}>
            <Text style={styles.title}>
                {removeParentheses(holiday?.title)}
            </Text>

            {!!holiday?.hebrewTitle && (
                <Text style={styles.hebrew}>{holiday.hebrewTitle}</Text>
            )}

            <Text style={styles.date}>
                {dateDisplay === false
                    ? holiday?.date
                    : holiday?.hebrewDate}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#202020",
        borderRadius: 18,
        padding: 18,
    },
    title: {
        color: "#82CBFF",
        fontSize: 18,
        marginBottom: 6,
    },
    hebrew: {
        color: "white",
        fontSize: 16,
        marginBottom: 6,
    },
    date: {
        color: "white",
        fontSize: 14,
        opacity: 0.75,
    },
});
