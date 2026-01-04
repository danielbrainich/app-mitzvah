import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Holidays from "./screens/Holidays";
import Shabbat from "./screens/Shabbat";
import Settings from "./screens/Settings";
import Info from "./screens/Info";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
    return (
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: "#202020",
                        borderTopColor: "#202020",
                    },
                    tabBarActiveTintColor: "#82CBFF",
                    tabBarInactiveTintColor: "rgba(255,255,255,0.65)",
                }}
            >
                <Tab.Screen name="Holidays" component={Holidays} />
                <Tab.Screen name="Shabbat" component={Shabbat} />
                <Tab.Screen name="Settings" component={Settings} />
                <Tab.Screen name="Info" component={Info} />
            </Tab.Navigator>
    );
}
