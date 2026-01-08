import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Holidays from "./screens/Holidays";
import Shabbat from "./screens/Shabbat";
import Settings from "./screens/Settings";
import Info from "./screens/Info";
import { colors } from "../styles/theme";


const Tab = createBottomTabNavigator();

export default function AppNavigator() {
    return (
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: colors.card,
                        borderTopColor: colors.card,
                    },
                    tabBarActiveTintColor: colors.accent,
                    tabBarInactiveTintColor: colors.muted,
                }}
            >
                <Tab.Screen name="Holidays" component={Holidays} />
                <Tab.Screen name="Shabbat" component={Shabbat} />
                <Tab.Screen name="Settings" component={Settings} />
                <Tab.Screen name="Info" component={Info} />
            </Tab.Navigator>
    );
}
