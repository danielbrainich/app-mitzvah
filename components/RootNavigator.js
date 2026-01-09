import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AppNavigator from "./AppNavigator"; // your tabs
import Settings from "./screens/Settings"; // your settings screen component
import { colors } from "../styles/theme";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.bg },
            }}
        >
            <Stack.Screen name="Tabs" component={AppNavigator} />

            {/* Slides in from right, covers full height */}
            <Stack.Screen
                name="Settings"
                component={Settings}
                options={{
                    presentation: "card",
                    animation: "slide_from_right",
                }}
            />
        </Stack.Navigator>
    );
}
