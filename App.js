import "react-native-gesture-handler";
import "react-native-reanimated";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { Animated } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./src/navigation/RootNavigator";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { store, persistor } from "./src/store/store";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { colors } from "./src/constants/theme";
import ErrorBoundary from "./src/components/common/ErrorBoundary";
import {
    PlayfairDisplay_700Bold,
    PlayfairDisplay_700Bold_Italic,
} from "@expo-google-fonts/playfair-display";
import {
    DMSans_400Regular,
    DMSans_500Medium,
} from "@expo-google-fonts/dm-sans";

// Keep splash screen visible while loading
SplashScreen.preventAutoHideAsync();

export default function App() {
    const [appIsReady, setAppIsReady] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        async function prepare() {
            try {
                await Font.loadAsync({
                    ChutzBold: require("./assets/fonts/Chutz-Bold.otf"),
                    PlayfairDisplay_700Bold,
                    PlayfairDisplay_700Bold_Italic,
                    DMSans_400Regular,
                    DMSans_500Medium,
                });

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
            await SplashScreen.hideAsync();

            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
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
                    backgroundColor: "colors.bg",
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
