import React from "react";
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaView } from "react-native-safe-area-context";

import Holidays from "../screens/Holidays";
import Shabbat from "../screens/Shabbat";
import { nav, ui } from "../constants/theme";
import useTodayIsoDay from "../hooks/useTodayIsoDay";
import { TopBar } from "../components/common/TopBar";
import CustomTabBar from "./CustomTabBar";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
    const todayIso = useTodayIsoDay();

    return (
        <SafeAreaView style={ui.safeArea} edges={["top", "left", "right"]}>
            <View style={nav.topSpacer} />

            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    sceneContainerStyle: nav.sceneContainer,
                }}
                tabBar={(props) => <CustomTabBar {...props} />}
            >
                <Tab.Screen name="Holidays" component={Holidays} />
                <Tab.Screen name="Shabbat" component={Shabbat} />
            </Tab.Navigator>

            <TopBar todayIso={todayIso} />
        </SafeAreaView>
    );
}
