import React from "react";
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Holidays from "./screens/Holidays";
import Shabbat from "./screens/Shabbat";
import { colors } from "../styles/theme";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
    return (
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
                    bottom: 36,
                    height: 68,
                    borderTopWidth: 0,
                    elevation: 0,
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
                    height: 56,
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
    );
}
