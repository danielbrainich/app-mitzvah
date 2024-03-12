import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { StatusBar } from "expo-status-bar";
import Holidays from "./Components/Holidays";
import Settings from "./Components/Settings";

export default function App() {
    const Stack = createNativeStackNavigator();

    return (
        <NavigationContainer>
            <StatusBar style="auto" />
            <Stack.Navigator
                initialRouteName="Holidays"
                screenOptions={{
                    headerStyle: {
                        backgroundColor: "black",
                    },
                    headerTintColor: "white",
                    title: "",
                }}
            >
                <Stack.Screen
                    name="Holidays"
                    component={Holidays}
                    options={({ navigation }) => ({
                        headerRight: () => (
                            <MaterialCommunityIcons
                                name="cog"
                                size={30}
                                onPress={() => navigation.navigate("Settings")}
                                title="Opt"
                                color="white"
                            />
                        ),
                    })}
                />
                <Stack.Screen name="Settings" component={Settings} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
