import React from "react";
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaView } from "react-native-safe-area-context";

import Holidays from "./screens/Holidays";
import Shabbat from "./screens/Shabbat";
import { colors } from "../styles/theme";
import { DEBUG_TODAY_ISO } from "../utils/debug";
import useTodayIsoDay from "../hooks/useTodayIsoDay";
import { TopBar } from "../components/TopBar";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
    const todayIso = useTodayIsoDay(DEBUG_TODAY_ISO);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
            <View
                style={{
                    height: 48,
                }}
            />
            <Tab.Navigator
                sceneContainerStyle={{
                    backgroundColor: colors.bg,
                }}
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                        position: "absolute",
                        left: 12,
                        right: 12,
                        bottom: 12,
                        height: 60,
                        borderTopWidth: 0,
                        borderRadius: 18,
                        marginHorizontal: 16,
                    },

                    tabBarBackground: () => (
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: colors.card,
                                borderRadius: 18,
                            }}
                        />
                    ),

                    tabBarActiveBackgroundColor: "rgba(130,203,255,0.15)",

                    tabBarItemStyle: {
                        height: 48,
                        borderRadius: 12,
                        marginTop: 6,
                        marginHorizontal: 6,
                    },

                    tabBarActiveTintColor: colors.accent,
                    tabBarInactiveTintColor: colors.muted,
                }}
            >
                <Tab.Screen name="Holidays" component={Holidays} />
                <Tab.Screen name="Shabbat" component={Shabbat} />
            </Tab.Navigator>
            <TopBar todayIso={todayIso} />
        </SafeAreaView>
    );
}
