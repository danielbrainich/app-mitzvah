import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable, Modal } from "react-native";
import { getHolidayDetailsByName } from "../utils/getHolidayDetails";

function removeParentheses(text) {
    return (text || "").replace(/\s*\([^)]*\)/g, "");
}

export default function TodayHolidayCard({ holiday, cardWidth }) {
    const [open, setOpen] = useState(false);

    const details = useMemo(
        () => getHolidayDetailsByName(holiday?.title),
        [holiday?.title]
    );

    const title = removeParentheses(holiday?.title);
    const description = details?.description || "";

    return (
        <View style={[styles.wrap, cardWidth ? { width: cardWidth } : null]}>
            <View style={styles.titleRow}>
                <Text style={styles.title}>{title}</Text>
            </View>

            {!!holiday?.hebrewTitle && (
                <Text style={styles.hebrew}>{holiday.hebrewTitle}</Text>
            )}
            {description ? (
                <Pressable
                    onPress={() => setOpen(true)}
                    hitSlop={12}
                    style={styles.infoButton}
                    accessibilityRole="button"
                    accessibilityLabel="More info"
                >
                    <Text style={styles.infoIcon}>ⓘ</Text>
                </Pressable>
            ) : null}
            <Modal
                transparent
                visible={open}
                animationType="fade"
                onRequestClose={() => setOpen(false)}
            >
                <Pressable
                    style={styles.modalBackdrop}
                    onPress={() => setOpen(false)}
                >
                    <Pressable style={styles.modalCard} onPress={() => {}}>
                        <Text style={styles.modalTitle}>{title}</Text>
                        {!!holiday?.hebrewTitle && (
                            <Text style={styles.modalHebrew}>
                                {holiday.hebrewTitle}
                            </Text>
                        )}
                        <Text style={styles.modalBody}>{description}</Text>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: {
        paddingVertical: 6,
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

    infoButton: {
        paddingTop: 10,
    },
    infoIcon: {
        color: "white",
        opacity: 0.9,
        fontSize: 18,
        fontWeight: "800", // <-- makes it bolder (works for Text)
    },

    hebrew: {
        color: "white",
        fontSize: 26,
        opacity: 0.95,
        marginTop: 8,
        marginBottom: 10,
    },

    preview: {
        color: "rgba(255,255,255,0.82)",
        fontSize: 14,
        lineHeight: 18,
    },

    modalBackdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.65)",
        justifyContent: "center",
        padding: 18,
    },
    modalCard: {
        borderWidth: 1,
        borderColor: "rgba(130,203,255,0.35)",
        backgroundColor: "rgba(0,0,0,0.92)",
        borderRadius: 14,
        padding: 16,
    },
    modalTitle: {
        color: "white",
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 8,
    },
    modalHebrew: {
        color: "#82CBFF",
        fontSize: 16,
        marginBottom: 12,
        opacity: 0.95,
    },
    modalBody: {
        color: "rgba(255,255,255,0.9)",
        fontSize: 14,
        lineHeight: 19,
    },
    modalClose: {
        marginTop: 16,
        alignSelf: "flex-end",
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    modalCloseText: {
        color: "#82CBFF",
        fontSize: 14,
        fontWeight: "600",
    },
});
