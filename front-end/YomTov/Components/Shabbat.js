import { useState, useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView} from "react-native";
import { useFonts } from "expo-font";
import * as Location from "expo-location";

export default function Shabbat() {
    const [fontsLoaded] = useFonts({
        Nayuki: require("../assets/fonts/NayukiRegular.otf"),
    });
    const [location, setLocation] = useState({});

    useEffect(() => {
        (async () => {
            let {status} = await Location.requestForegroundPermissionsAsync();
            if (status = 'granted') {
                console.log('Permission granted');
            } else {
                console.log('Permission denied');
            }

            const loc = await Location.getCurrentPositionAsync();
            console.log(loc);
            setLocation(loc);

        })();
    }, [])


    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollViewContent}>
                {fontsLoaded ? (
                    <>
                        <View style={styles.frame}>
                            <Text style={styles.headerText}>Shabbat</Text>
                            <Text style={styles.headerText}>The Date</Text>
                            <Text style={styles.headerText}>Candle Lighting</Text>
                            <Text style={styles.headerText}>7:00 PM</Text>
                            <Text style={styles.headerText}>Havdalah</Text>
                            <Text style={styles.headerText}>8:00 PM</Text>
                        </View>
                    </>
                ) : null}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "flex-start",
        justifyContent: "flex-start",
        backgroundColor: "black",
    },
    scrollViewContent: {
        flex: 1,
        alignSelf: "stretch",
    },
    frame: {
        padding: 20,
    },
    card: {
        padding: 20,
        backgroundColor: "#82CBFF",
        margin: 20,
        borderRadius: 8,
    },
    cardHeaderText: {
        color: "black",
        fontSize: 20,
        marginBottom: 10,
    },
    cardBigBoldText: {
        color: "black",
        fontFamily: "Nayuki",
        fontSize: 44,
        marginBottom: 2,
    },
    cardHebrewText: {
        color: "black",
        fontSize: 24,
        marginBottom: 10,
    },
    cardDateText: {
        color: "black",
        fontSize: 18,
        marginBottom: 0,
    },
    headerText: {
        color: "white",
        fontSize: 26,
        marginBottom: 16,
    },
    bigBoldText: {
        color: "#82CBFF",
        fontFamily: "Nayuki",
        fontSize: 72,
        marginBottom: 2,
    },
    hebrewText: {
        color: "white",
        fontSize: 38,
        marginBottom: 18,
    },
    dateText: {
        color: "white",
        fontSize: 22,
        marginBottom: 24,
    },
    paragraphText: {
        color: "white",
        fontSize: 24,
    },
});
