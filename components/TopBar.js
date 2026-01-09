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
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Pressable
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setShowHebrew((v) => !v);
                    }}
                    hitSlop={12}
                    style={{ paddingVertical: 6, paddingRight: 10 }}
                >
                    <Text
                        style={{
                            color: "white",
                            fontSize: 14,
                            borderColor: "white",
                            borderRadius: 18,
                            paddingVertical: 8,
                            paddingHorizontal: 16,
                            backgroundColor: colors.card,
                        }}
                    >
                        {label}
                    </Text>
                </Pressable>

                {/* Dots -> Settings */}
                <Pressable
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        navigation.navigate("Settings");
                    }}
                    hitSlop={12}
                    style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "rgba(255,255,255,0.06)",
                    }}
                >
                    <Entypo
                        name="dots-three-horizontal"
                        size={18}
                        color="#fff"
                    />
                </Pressable>

                <View style={{ width: 36, height: 36 }} />
                {/* keep this empty for now; later you’ll put the settings icon here */}
            </View>
        </SafeAreaView>
    );
}
