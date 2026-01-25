import React, { useMemo } from "react";
import { View, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import Holidays from "../screens/Holidays";
import Shabbat from "../screens/Shabbat";
import { colors, nav, ui } from "../constants/theme";
import useTodayIsoDay from "../hooks/useTodayIsoDay";
import { TopBar } from "../components/common/TopBar";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
    const todayIso = useTodayIsoDay();

    // Keeps the object stable so Tab.Navigator doesn't re-render options every render
    const screenOptions = useMemo(
        () => ({
            headerShown: false,
            tabBarIcon: () => null,

            sceneContainerStyle: nav.sceneContainer,

            tabBarBackground: () => <View style={nav.tabBarBackground} />,

            tabBarActiveBackgroundColor: nav.tabBarActiveBg,
            tabBarStyle: nav.tabBarStyle,
            tabBarItemStyle: nav.tabBarItemStyle,
            tabBarLabelStyle: nav.tabBarLabelStyle,

            tabBarActiveTintColor: "white",
            tabBarInactiveTintColor: colors.muted,
        }),
        []
    );

    const hapticTabPress = useMemo(
        () => ({
            tabPress: () => {
                // Haptics only work on iOS and Android
                if (Platform.OS === "ios" || Platform.OS === "android") {
                    Haptics.impactAsync(
                        Haptics.ImpactFeedbackStyle.Light
                    ).catch((err) => {
                        // Silent fail - haptics are nice-to-have, not critical
                        console.debug("Haptic feedback failed:", err);
                    });
                }
            },
        }),
        []
    );

    return (
        <SafeAreaView style={ui.safeArea} edges={["top", "left", "right"]}>
            <View style={nav.topSpacer} />

            <Tab.Navigator screenOptions={screenOptions}>
                <Tab.Screen
                    name="Holidays"
                    component={Holidays}
                    listeners={hapticTabPress}
                />
                <Tab.Screen
                    name="Shabbat"
                    component={Shabbat}
                    listeners={hapticTabPress}
                />
            </Tab.Navigator>

            <TopBar todayIso={todayIso} />
        </SafeAreaView>
    );
}
