import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function TabBar({ state, descriptors, navigation }) {
    return (
        <View style={styles.headerContainer}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.title !== undefined ? options.title : route.name;
                const isFocused = state.index === index;
                const onPress = () => {
                    const event = navigation.emit({
                        type: "tabPress",
                        target: route.key,
                        canPreventDefault: true,
                    });
                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };
                return (
                    <TouchableOpacity
                        key={route.key}
                        onPress={onPress}
                        style={styles.buttons}
                    >
                        <Text
                            style={[
                                { color: isFocused ? "#82CBFF" : "white" },
                                styles.headers,
                            ]}
                        >
                            {label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: "row",
        backgroundColor: "black",
        justifyContent: "space-around",
    },
    headers: {
        fontSize: 16,
        fontWeight: "bold",
    },
    buttons: {},
});
