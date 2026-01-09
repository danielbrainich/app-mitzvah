import "react-native-gesture-handler";
import "react-native-reanimated";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./components/RootNavigator";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import * as Font from "expo-font";
import AppNavigator from "./components/AppNavigator";
import { store, persistor } from "./store/store";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { colors } from "./styles/theme";


const Stack = createNativeStackNavigator();

const screenOptions = {
    headerStyle: { backgroundColor: colors.bg },
    headerTintColor: colors.bg,
    title: "",
};

export default function App() {
    const [fontLoaded, setFontLoaded] = useState(false);

    useEffect(() => {
        let isMounted = true;

        Font.loadAsync({
            ChutzBold: require("./assets/fonts/Chutz-Bold.otf"),
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
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <BottomSheetModalProvider>
                        <NavigationContainer>
                        <RootNavigator />

                        </NavigationContainer>
                    </BottomSheetModalProvider>
                </PersistGate>
            </Provider>
        </GestureHandlerRootView>
    );
}
