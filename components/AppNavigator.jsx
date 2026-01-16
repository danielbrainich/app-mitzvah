import React, { useMemo } from "react";
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import Holidays from "./screens/Holidays";
import Shabbat from "./screens/Shabbat";
import { colors, nav } from "../styles/theme";
import useTodayIsoDay from "../hooks/useTodayIsoDay";
import { TopBar } from "./TopBar";
import { ui } from "../styles/theme";

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
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            },
        }),
        []
    );

    return (
        <SafeAreaView style={ui.safeArea}>
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
