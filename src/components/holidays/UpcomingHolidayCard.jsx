import React, { useMemo, useCallback } from "react";
import { View, Text, Pressable, Platform, StyleSheet } from "react-native";
import { formatGregorianLongFromIso } from "../../utils/datetime";
import { ui } from "../../constants/theme";
import * as Haptics from "expo-haptics";
import { Entypo } from "@expo/vector-icons";

export default function UpcomingHolidayCard({ holiday, onAbout }) {
    const gregLabel = useMemo(() => {
        if (!holiday?.date) return "";
        return formatGregorianLongFromIso(holiday.date);
    }, [holiday?.date]);

    const onPressDots = useCallback(() => {
        if (Platform.OS === "ios" || Platform.OS === "android") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
                () => {}
            );
        }
        onAbout?.(holiday);
    }, [onAbout, holiday]);

    return (
        <View style={ui.card}>
            <View style={styles.header}>
                <View style={styles.textContainer}>
                    <Text style={ui.label}>{gregLabel}</Text>

                    <Pressable
                        onPress={onPressDots}
                        disabled={!onAbout}
                        hitSlop={8}
                    >
                        <Text
                            style={[ui.h6, ui.textBrand]}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {holiday?.title ?? ""}
                        </Text>

                        {!!holiday?.hebrewTitle && (
                            <Text style={styles.hebrewText}>
                                {holiday.hebrewTitle}
                            </Text>
                        )}
                    </Pressable>
                </View>

                {onAbout && (
                    <Pressable
                        onPress={onPressDots}
                        hitSlop={12}
                        style={ui.iconButton}
                    >
                        <Entypo
                            name="dots-three-vertical"
                            size={18}
                            color="white"
                        />
                    </Pressable>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    hebrewText: {
        fontSize: 16,
        color: "#82CBFF",
        writingDirection: "rtl",
        textAlign: "left",
        marginTop: 3,
    },
});
