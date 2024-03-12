import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Button } from "react-native";
import Holidays from "./Components/Holidays";
import Options from "./Components/Options";

export default function App() {
    const Stack = createNativeStackNavigator();

    return (
        <NavigationContainer>
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
                                onPress={() => navigation.navigate("Options")}
                                title="Opt"
                                color="white"
                            />
                        ),
                    })}
                />
                <Stack.Screen name="Options" component={Options} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
