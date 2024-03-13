import { useState, useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { useFonts } from "expo-font";
import * as Location from "expo-location";

export default function Shabbat() {
    const [fontsLoaded] = useFonts({
        Nayuki: require("../assets/fonts/NayukiRegular.otf"),
    });
    const [location, setLocation] = useState({});
    const [shabbatInfo, setShabbatInfo] = useState({});
    const [coordinates, setCoordinates] = useState("");

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                console.log("Permission denied");
                return;
            }
            const loc = await Location.getCurrentPositionAsync();
            console.log(loc);
            setLocation(loc);
            const coords = `${loc.coords.latitude},${loc.coords.longitude}`;
            console.log(coords);
            setCoordinates(coords);
        })();
    }, []);

    useEffect(() => {
        const fetchShabbatInfo = async () => {
            if (coordinates === "") {
                return;
            }
            const date = new Date().toISOString().split("T")[0];
            console.log(date);
            try {
                const response = await fetch(
                    `http://localhost:8000/api/shabbat/${date}/${coordinates}`
                );
                if (!response.ok) {
                    throw new Error(
                        "Something went wrong fetching Shabbat info!"
                    );
                }
                const data = await response.json();
                console.log(data);
                setShabbatInfo(data.shabbat_info);
            } catch (error) {
                console.error(
                    "Something went wrong fetching Shabbat info!",
                    error
                );
            }
        };
        fetchShabbatInfo(coordinates);
    }, [coordinates]);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollViewContent}>
                {fontsLoaded ? (
                    <>
                        {console.log(shabbatInfo)}
                        <View style={styles.frame}>
                            {shabbatInfo.candle_time && (
                                <Text style={styles.headerText}>
                                    Candle Lighting: {shabbatInfo.candle_time.split(": ")[1]}
                                </Text>
                            )}

                            {shabbatInfo.parasha_eng && (
                                <Text style={styles.headerText}>
                                    Parasha (English): {shabbatInfo.parasha_eng}
                                </Text>
                            )}

                            {shabbatInfo.parasha_heb && (
                                <Text style={styles.headerText}>
                                    Parasha (Hebrew): {shabbatInfo.parasha_heb}
                                </Text>
                            )}

                            {shabbatInfo.parasha_date && (
                                <Text style={styles.headerText}>
                                    Parasha Date: {shabbatInfo.parasha_date}
                                </Text>
                            )}

                            {shabbatInfo.havdalah_time && (
                                <Text style={styles.headerText}>
                                    Havdalah: {shabbatInfo.havdalah_time.split(": ")[1]}
                                </Text>
                            )}

                            {shabbatInfo.start_date && (
                                <Text style={styles.headerText}>
                                    Shabbat Start: {shabbatInfo.start_date}
                                </Text>
                            )}
                            {shabbatInfo.end_date && (
                                <Text style={styles.headerText}>
                                    Shabbat End: {shabbatInfo.end_date}
                                </Text>
                            )}
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
