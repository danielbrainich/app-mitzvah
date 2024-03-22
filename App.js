import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { StatusBar } from "expo-status-bar";
import Settings from "./components/Settings";
import Information from "./components/Information";
import { StyleSheet } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import TabBarTabs from "./components/TabBarTabs";
import { Provider } from "react-redux";
import store from "./store/store";
import * as Font from "expo-font";

export default function App() {
    const Stack = createNativeStackNavigator();
    const Tab = createMaterialTopTabNavigator();
    const [fontLoaded, setFontLoaded] = useState(false);

    useEffect(() => {
        Font.loadAsync({
            Nayuki: require("./assets/fonts/NayukiRegular.otf"),
        }).then(() => {
            setFontLoaded(true);
        });
    }, []);

    if (!fontLoaded) return null;

    return (
        <Provider store={store}>
            <NavigationContainer>
                <StatusBar style="light" />
                <Stack.Navigator
                    initialRouteName="Tabs"
                    screenOptions={{
                        headerStyle: {
                            backgroundColor: "black",
                        },
                        headerTintColor: "white",
                        title: "",
                    }}
                >
                    <Stack.Screen
                        name="Tabs"
                        component={TabBarTabs}
                        options={({ navigation }) => ({
                            headerRight: () => (
                                <>
                                    <MaterialCommunityIcons
                                        name="information"
                                        size={30}
                                        onPress={() =>
                                            navigation.navigate("Information")
                                        }
                                        color="white"
                                        marginRight={10}
                                    />
                                    <MaterialCommunityIcons
                                        name="cog"
                                        size={30}
                                        onPress={() =>
                                            navigation.navigate("Settings")
                                        }
                                        color="white"
                                    />
                                </>
                            ),
                            title: "",

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
        </Provider>
    );
}

const styles = StyleSheet.create({
    headerTitleContainer: {
        flexDirection: "row",
    },
    tabFont: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 12,
        marginRight: 12,
    },
});
