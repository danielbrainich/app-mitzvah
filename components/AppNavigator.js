import React from "react";
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

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
                    tabBarIcon: () => null,

                    tabBarBackground: () => (
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: colors.card,
                                borderRadius: 18,
                            }}
                        />
                    ),

                    tabBarActiveBackgroundColor: "#313131",

                    tabBarItemStyle: {
                        flex: 1,
                        margin: 8,
                        borderRadius: 10
                    },

                    tabBarLabelStyle: {
                        fontSize: 17,
                        textAlign: "center",
                        // here
                    },

                    tabBarStyle: {
                        position: "absolute",
                        left: 16,
                        right: 16,
                        bottom: 8,
                        height: 64,
                        borderTopWidth: 0,
                        marginHorizontal: 24,
                        paddingTop: 0,
                        paddingBottom: 0,
                    },

                    tabBarActiveTintColor: colors.accent,
                    tabBarInactiveTintColor: colors.muted,


                }}
            >
                <Tab.Screen
                    name="Holidays"
                    component={Holidays}
                    listeners={{
                        tabPress: () => {
                            Haptics.impactAsync(
                                Haptics.ImpactFeedbackStyle.Light
                            );
                        },
                    }}
                />

                <Tab.Screen
                    name="Shabbat"
                    component={Shabbat}
                    listeners={{
                        tabPress: () => {
                            Haptics.impactAsync(
                                Haptics.ImpactFeedbackStyle.Light
                            );
                        },
                    }}
                />
            </Tab.Navigator>
            <TopBar todayIso={todayIso} />
        </SafeAreaView>
    );
}
