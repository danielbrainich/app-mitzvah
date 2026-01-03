import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Holidays from "./screens/Holidays";
import Shabbat from "./screens/Shabbat";
import Settings from "./screens/Settings";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
    return (
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: "black",
                        borderTopColor: "rgba(255,255,255,0.12)",
                    },
                    tabBarActiveTintColor: "#82CBFF",
                    tabBarInactiveTintColor: "rgba(255,255,255,0.65)",
                }}
            >
                <Tab.Screen name="Holidays" component={Holidays} />
                <Tab.Screen name="Shabbat" component={Shabbat} />
                <Tab.Screen name="Settings" component={Settings} />
            </Tab.Navigator>
    );
}
