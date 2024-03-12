import { useFonts } from "expo-font";
import { StyleSheet, Text, SafeAreaView, View } from "react-native";


export default function Options() {
    const [fontsLoaded] = useFonts({
        Nayuki: require("../assets/fonts/NayukiRegular.otf"),
    });

    return (
        <SafeAreaView style={styles.container}>
            {fontsLoaded ? (
                <View style={styles.frame}>
                    <Text style={styles.headerText}>Options</Text>
                </View>
            ) : (
                <AppLoading />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
        alignItems: "center",
        justifyContent: "center",
    },
    frame: {
        padding: 20,
    },
    headerText: {
        fontFamily: "Nayuki",
        fontSize: 40,
        color: "white",
    },
    bigBoldText: {
        fontFamily: "Nayuki",
        fontSize: 30,
        color: "white",
    },
});
