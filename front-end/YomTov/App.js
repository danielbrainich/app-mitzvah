import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { StatusBar } from "expo-status-bar";
import Settings from "./components/Settings";
import { StyleSheet } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import TabBarTabs from "./components/TabBarTabs";


export default function App() {
    const Stack = createNativeStackNavigator();
    const Tab = createMaterialTopTabNavigator();

    return (
        <NavigationContainer>
            <StatusBar style="auto" />
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
                            <MaterialCommunityIcons
                                name="cog"
                                size={30}
                                onPress={() => navigation.navigate("Settings")}
                                color="white"
                            />
                        ),
                        title: "",
                    })}
                />
                <Stack.Screen name="Settings" component={Settings} />
            </Stack.Navigator>
        </NavigationContainer>
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
