import 'react-native-gesture-handler';
import 'react-native-reanimated';
import React, { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import * as Font from "expo-font";

import TabBarTabs from "./components/TabBarTabs";
import Settings from "./components/Settings";
import Information from "./components/Information";
import { store, persistor } from "./store/store";

const Stack = createNativeStackNavigator();

const screenOptions = {
    headerStyle: { backgroundColor: "black" },
    headerTintColor: "white",
    title: "",
};

function HeaderIconButton({ name, onPress, label, style }) {
    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={label}
            hitSlop={10}
            style={style}
        >
            <MaterialCommunityIcons name={name} size={30} color="white" />
        </Pressable>
    );
}

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
                // Don’t hard-brick the app if the font fails to load.
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
                    <Stack.Navigator
                        initialRouteName="Tabs"
                        screenOptions={screenOptions}
                    >
                        <Stack.Screen
                            name="Tabs"
                            component={TabBarTabs}
                            options={({ navigation }) => ({
                                headerRight: () => (
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            gap: 12,
                                        }}
                                    >
                                        <HeaderIconButton
                                            name="information"
                                            label="Information"
                                            onPress={() =>
                                                navigation.navigate(
                                                    "Information"
                                                )
                                            }
                                        />
                                        <HeaderIconButton
                                            name="cog"
                                            label="Settings"
                                            onPress={() =>
                                                navigation.navigate("Settings")
                                            }
                                        />
                                    </View>
                                ),
                                headerTitleStyle: {
                                    color: "#82CBFF",
                                    fontSize: 20,
                                    fontFamily: "Nayuki",
                                },
                            })}
                        />
                        <Stack.Screen
                            name="Settings"
                            component={Settings}
                            options={{ headerBackTitleVisible: false }}
                        />
                        <Stack.Screen
                            name="Information"
                            component={Information}
                            options={{ headerBackTitleVisible: false }}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            </PersistGate>
        </Provider>
    );
}
