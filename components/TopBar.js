import React, { useMemo, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import {
    formatGregorianLongFromIso,
    formatHebrewLongFromIso,
} from "../utils/datetime";
import { colors } from "../styles/theme";
import * as Haptics from "expo-haptics";
import { Entypo } from "@expo/vector-icons";

const TOPBAR_H = 44;

export function TopBar({ todayIso }) {
    const navigation = useNavigation();
    const [showHebrew, setShowHebrew] = useState(false);

    const label = useMemo(() => {
        return showHebrew
            ? formatHebrewLongFromIso(todayIso)
            : formatGregorianLongFromIso(todayIso);
    }, [todayIso, showHebrew]);

    return (
        <SafeAreaView
            edges={["top", "left", "right"]}
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
            }}
        >
            <View
                style={{
                    height: TOPBAR_H,
                    paddingHorizontal: 16,
                    justifyContent: "center",
                    position: "relative",
                }}
            >
                {/* LEFT: Date pill pinned to left */}
                <Pressable
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setShowHebrew((v) => !v);
                    }}
                    hitSlop={12}
                    style={{
                        position: "absolute",
                        left: 16,
                        paddingVertical: 6,
                    }}
                >
                    <Text
                        style={{
                            color: "white",
                            fontSize: 14,
                            borderRadius: 18,
                            paddingVertical: 8,
                            paddingHorizontal: 16,
                            backgroundColor: colors.card,
                        }}
                        numberOfLines={1}
                    >
                        {label}
                    </Text>
                </Pressable>

                {/* RIGHT: Gear pinned to right */}
                <Pressable
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        navigation.navigate("Settings");
                    }}
                    hitSlop={12}
                    style={{
                        position: "absolute",
                        right: 16,
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "rgba(255,255,255,0.06)",
                    }}
                >
                    <Entypo name="cog" size={22} color="#fff" />
                </Pressable>
            </View>
        </SafeAreaView>
    );
}
