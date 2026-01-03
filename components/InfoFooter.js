import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function InfoFooter() {
    return (
        <View style={styles.wrap}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.body}>
                Candle lighting and Havdalah times are based on coordinates and
                elevation provided by your device.
            </Text>
            <Text style={styles.body}>
                AppMitzvah was inspired by isitajewishholidaytoday.com and is
                powered by Hebcal.
            </Text>
            <Text style={styles.body}>
                AppMitzvah was developed by Daniel Brainich and designed by
                Andrea Portillo.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: {
        marginTop: 24,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: "rgba(255,255,255,0.10)",
    },
    sectionTitle: {
        color: "rgba(130,203,255,0.95)",
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 6,
        marginTop: 10,
        letterSpacing: 0.2,
    },
    body: {
        color: "rgba(255,255,255,0.75)",
        fontSize: 13,
        lineHeight: 18,
        marginBottom: 6,
    },
    italic: {
        fontStyle: "italic",
    },
});
