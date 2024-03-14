import { useFonts } from "expo-font";
import { StyleSheet, Text, SafeAreaView, View, ScrollView } from "react-native";

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
                        This app provides information about Jewish holidays and
                        Shabbat times.
                    </Text>
                    <Text style={styles.smallText}>
                        Candle lighting and Havdalah times are based on coordinates and elevation provided by your device.
                    </Text>
                    <Text style={styles.smallText}>
                        Consult a <Text style={{fontStyle: 'italic'}}>halachic</Text> authority for exact times
                        according to your <Text style={{fontStyle: 'italic'}}>minhag</Text> and location.
                    </Text>
                    <Text style={styles.smallText}>
                        This app's candle lighting time is calculated as 18 minutes before sunset.
                    </Text>
                    <Text style={styles.smallText}>
                        This app's default Havdalah time is <Text style={{fontStyle: 'italic'}}>tzeit hakochavim</Text>, calculated as the time the sun is 8.5 degrees below the horizon.
                    </Text>
                    <Text style={styles.headerText}>Credits</Text>
                    <Text style={styles.smallText}>
                        This app was inspired by isitajewishholidaytoday.com and
                        is powered by the hebcal.com API.
                    </Text>
                    <Text style={styles.headerText}>Us</Text>
                    <Text style={styles.smallText}>
                        This app was developed by Daniel Brainich and designed by Andrea Portillo.
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
