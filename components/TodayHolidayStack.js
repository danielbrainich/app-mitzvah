import React, { useMemo } from "react";
import { View, Text, Pressable } from "react-native";
import * as Haptics from "expo-haptics";
import { Entypo } from "@expo/vector-icons";
import { ui } from "../styles/theme";

export default function TodayHolidayStack({ holidays = [], onAbout }) {
    const count = holidays?.length ?? 0;

    // Only intended for 2+; caller should guard.
    const layout = useMemo(() => {
        if (count === 2) {
            return {
                gap: 14,
                minCardHeight: 132,
                titleSize: 28,
                hebSize: 16,
            };
        }
        // 3+
        return {
            gap: 12,
            minCardHeight: 108,
            titleSize: 22,
            hebSize: 15,
        };
    }, [count]);

    return (
        <View style={{ width: "100%" }}>
            {/* Stack cards under "Today is" — do NOT center the whole block */}
            <View style={{ gap: layout.gap }}>
                {holidays.map((h) => {
                    if (!h) return null;

                    return (
                        <View
                            key={h.id ?? `${h.title}-${h.date}`}
                            style={[
                                ui.upcomingHolidayCard,
                                {
                                    minHeight: layout.minCardHeight,

                                    // ✅ make it a row so dots can sit on the right
                                    flexDirection: "row",
                                    alignItems: "center",
                                },
                            ]}
                        >
                            {/* LEFT: titles */}
                            <View style={{ flex: 1, paddingRight: 10 }}>
                                <Text
                                    style={[
                                        ui.upcomingHolidayTitle,
                                        {
                                            fontSize: layout.titleSize,
                                            lineHeight: layout.titleSize + 2,
                                            marginBottom: 6,
                                        },
                                    ]}
                                    numberOfLines={2}
                                    ellipsizeMode="tail"
                                >
                                    {h.title}
                                </Text>

                                {!!h.hebrewTitle && (
                                    <Text
                                        style={[
                                            ui.upcomingHolidayHebrew,
                                            {
                                                fontSize: layout.hebSize,
                                                marginBottom: 2,
                                            },
                                        ]}
                                        numberOfLines={1}
                                        ellipsizeMode="tail"
                                    >
                                        {h.hebrewTitle}
                                    </Text>
                                )}
                            </View>

                            {/* RIGHT: vertical dots */}
                            <Pressable
                                onPress={() => {
                                    Haptics.impactAsync(
                                        Haptics.ImpactFeedbackStyle.Light
                                    );
                                    onAbout?.(h);
                                }}
                                hitSlop={12}
                                style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: 16,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginLeft: 8,
                                }}
                                accessibilityRole="button"
                                accessibilityLabel="More info"
                            >
                                <Entypo
                                    name="dots-three-vertical"
                                    size={18}
                                    color="white"
                                />
                            </Pressable>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}
