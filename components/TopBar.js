import React, { useMemo, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    formatGregorianLongFromIso,
    formatHebrewLongFromIso,
} from "../utils/datetime";
import { colors } from "../styles/theme";

const TOPBAR_H = 44;

export function TopBar({ todayIso }) {
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
                    onPress={() => setShowHebrew((v) => !v)}
                    hitSlop={12}
                    style={{ paddingVertical: 6, paddingRight: 10 }}
                >
                    <Text style={{ color: colors.muted, fontSize: 14 }}>
                        {label}
                    </Text>
                </Pressable>

                <View style={{ width: 36, height: 36 }} />
                {/* keep this empty for now; later you’ll put the settings icon here */}
            </View>
        </SafeAreaView>
    );
}
