import React from "react";
import { StyleSheet } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import Holidays from "./Holidays";
import Shabbat from "./Shabbat";

const Tab = createMaterialTopTabNavigator();

export default function TabBarTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: styles.tabBar,
                tabBarIndicatorStyle: styles.tabBarIndicator,
                tabBarActiveTintColor: "#82CBFF",
                tabBarInactiveTintColor: "white",
                tabBarLabelStyle: styles.tabBarLabel,
            }}
        >
            <Tab.Screen name="Holidays" component={Holidays} />
            <Tab.Screen name="Shabbat" component={Shabbat} />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: "black",
    },
    tabBarIndicator: {
        backgroundColor: "#82CBFF",
        height: 3,
    },
    tabBarLabel: {
        fontSize: 16,
        fontWeight: "bold",
        textTransform: "none",
    },
});
