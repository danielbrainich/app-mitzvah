import "react-native-gesture-handler";
import "react-native-reanimated";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { Animated } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./src/navigation/RootNavigator";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { store, persistor } from "./src/store/store";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { colors } from "./src/constants/theme";
import ErrorBoundary from "./src/components/common/ErrorBoundary";

// Keep splash screen visible while loading
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

const screenOptions = {
    headerStyle: { backgroundColor: colors.bg },
    headerTintColor: colors.bg,
    title: "",
};

export default function App() {
    const [appIsReady, setAppIsReady] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current; // Start at 0 (invisible)

    useEffect(() => {
        async function prepare() {
            try {
                // Load fonts
                await Font.loadAsync({
                    ChutzBold: require("./assets/fonts/Chutz-Bold.otf"),
                });

                // Small delay to ensure everything is ready
                await new Promise((resolve) => setTimeout(resolve, 100));
            } catch (err) {
                console.warn("Failed to load resources:", err);
            } finally {
                setAppIsReady(true);
            }
        }

        prepare();
    }, []);

    const onLayoutRootView = useCallback(async () => {
        if (appIsReady) {
            // Hide splash immediately
            await SplashScreen.hideAsync();

            // Then fade in the app
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 700,
                useNativeDriver: true,
            }).start();
        }
    }, [appIsReady, fadeAnim]);

    if (!appIsReady) {
        return null;
    }

    return (
        <ErrorBoundary fallbackMessage="App Mitzvah encountered an error. Please restart.">
            <Animated.View
                style={{
                    flex: 1,
                    opacity: fadeAnim,
                    backgroundColor: "#000000",
                }}
                onLayout={onLayoutRootView}
            >
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
            </Animated.View>
        </ErrorBoundary>
    );
}
