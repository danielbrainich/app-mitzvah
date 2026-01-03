import "react-native-gesture-handler";
import "react-native-reanimated";
import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import * as Font from "expo-font";
import AppNavigator from "./components/AppNavigator";
import { store, persistor } from "./store/store";

const Stack = createNativeStackNavigator();

const screenOptions = {
    headerStyle: { backgroundColor: "black" },
    headerTintColor: "white",
    title: "",
};

export default function App() {
    const [fontLoaded, setFontLoaded] = useState(false);

    useEffect(() => {
        let isMounted = true;

        Font.loadAsync({
            Nayuki: require("./assets/fonts/NayukiRegular.otf"),
        })
            .then(() => {
                if (isMounted) setFontLoaded(true);
            })
            .catch((err) => {
                console.warn("Failed to load font:", err);
                if (isMounted) setFontLoaded(true);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    if (!fontLoaded) return null;

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <NavigationContainer>
                    <StatusBar style="light" />

                    <Stack.Navigator screenOptions={screenOptions}>
                        <Stack.Screen
                            name="Tabs"
                            component={AppNavigator}
                            options={{ headerShown: false }}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            </PersistGate>
        </Provider>
    );
}
