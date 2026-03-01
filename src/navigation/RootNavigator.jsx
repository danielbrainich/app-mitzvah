import React from "react";
import { Platform } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AppNavigator from "./AppNavigator";
import AppNavigatorWeb from "./AppNavigatorWeb";
import Settings from "../screens/Settings";
import ErrorBoundary from "../components/common/ErrorBoundary";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
    if (Platform.OS === "web") {
        return (
            <ErrorBoundary fallbackMessage="Something went wrong. Please refresh.">
                <AppNavigatorWeb />
            </ErrorBoundary>
        );
    }

    return (
        <ErrorBoundary fallbackMessage="Navigation error occurred. Please restart the app.">
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Tabs" component={AppNavigator} />
                <Stack.Screen
                    name="Settings"
                    component={Settings}
                    options={{
                        presentation: "card",
                        animation: "slide_from_right",
                    }}
                />
            </Stack.Navigator>
        </ErrorBoundary>
    );
}
