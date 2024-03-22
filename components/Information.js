import { useFonts } from "expo-font";
import { StyleSheet, Text, SafeAreaView, ScrollView } from "react-native";

export default function Settings() {
    const [fontsLoaded] = useFonts({
        Nayuki: require("../assets/fonts/NayukiRegular.otf"),
    });

    return (
        <SafeAreaView style={styles.container}>
            {fontsLoaded ? (
                <ScrollView style={styles.frame}>
                    <Text style={styles.headerText}>About</Text>
                    <Text style={styles.smallText}>
                        AppMitzvah provides information about Jewish holidays
                        and Shabbat times.
                    </Text>
                    <Text style={styles.headerText}>Important</Text>
                    <Text style={styles.smallText}>
                        Candle lighting and Havdalah times are based on
                        coordinates and elevation provided by your device.
                        Consult a{" "}
                        <Text style={{ fontStyle: "italic" }}>halachic</Text>{" "}
                        authority for exact times based on your community's
                        customs.
                    </Text>
                    <Text style={styles.headerText}>Credits</Text>
                    <Text style={styles.smallText}>
                        AppMitzvah was inspired by isitajewishholidaytoday.com
                        and is powered by Hebcal.
                    </Text>
                    <Text style={styles.headerText}>Us</Text>
                    <Text style={styles.smallText}>
                        AppMitzvah was developed by Daniel Brainich and designed
                        by Andrea Portillo.
                    </Text>
                </ScrollView>
            ) : null}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
        alignItems: "flex-start",
        justifyContent: "flex-start",
    },
    frame: {
        padding: 20,
    },
    headerText: {
        color: "#82CBFF",
        fontSize: 30,
        marginBottom: 22,
    },
    smallText: {
        color: "white",
        fontSize: 20,
        marginBottom: 18,
    },
});
