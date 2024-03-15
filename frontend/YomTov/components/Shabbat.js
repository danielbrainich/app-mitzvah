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
    const [locationData, setLocationData] = useState("");
    const [timezone, setTimezone] = useState("");

    useEffect(() => {
        const fetchLocationData = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                console.log("Permission denied");
                return;
            }
            const locationObject = await Location.getCurrentPositionAsync();
            const { latitude, longitude, altitude } = locationObject.coords;
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            setLocation(locationObject);
            const locationData = {
                latitude,
                longitude,
                altitude,
                timezone,
            };
            console.log("locationData_", locationData);
            setLocationData(locationData)
        };

        fetchLocationData();
    }, []);

    useEffect(() => {
        const fetchShabbatInfo = async () => {
            if (!locationData) {
                return;
            }
            const date = new Date().toISOString().split("T")[0];
            try {
                const queryParams = new URLSearchParams({
                    latitude: locationData.latitude.toString(),
                    longitude: locationData.longitude.toString(),
                    altitude: locationData.altitude.toString(),
                    timezone: locationData.timezone.toString(),
                });
                const url = `http://localhost:8000/api/shabbat/${date}?${queryParams}`;
                console.log("url", url);
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error("Something went wrong fetching Shabbat info!");
                }
                const data = await response.json();
                setShabbatInfo(data.shabbat_info);
            } catch (error) {
                console.error("Something went wrong fetching Shabbat info!", error);
            }
        };
        fetchShabbatInfo();
    }, [locationData]);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollViewContent}>
                {fontsLoaded ? (
                    <>
                        {console.log(shabbatInfo)}
                        <View style={styles.frame}>
                            {shabbatInfo.candle_time && (
                                <Text style={styles.headerText}>
                                    Candle Lighting:{" "}
                                    {shabbatInfo.candle_time.split(": ")[1]}
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
                                    Havdalah:{" "}
                                    {shabbatInfo.havdalah_time.split(": ")[1]}
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
                            {shabbatInfo.time_zone && (
                                <Text style={styles.headerText}>
                                    Timezone: {shabbatInfo.time_zone}
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
