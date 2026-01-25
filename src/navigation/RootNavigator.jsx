import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AppNavigator from "./AppNavigator";
import Settings from "../screens/Settings";
import ErrorBoundary from "../components/common/ErrorBoundary";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
    return (
        <ErrorBoundary fallbackMessage="Navigation error occurred. Please restart the app.">
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}
            >
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
