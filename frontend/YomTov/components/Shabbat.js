import { useState, useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { useFonts } from "expo-font";
import * as Location from "expo-location";
import { useSelector } from "react-redux";

export default function Shabbat() {
    const [fontsLoaded] = useFonts({
        Nayuki: require("../assets/fonts/NayukiRegular.otf"),
    });
    const [location, setLocation] = useState({});
    const [shabbatInfo, setShabbatInfo] = useState({});
    const [locationData, setLocationData] = useState("");
    const dateDisplay = useSelector((state) => state.dateDisplay);
    const today = new Date().toISOString().split("T")[0];
    // const today = "2024-12-29";


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
            setLocationData(locationData);
        };

        fetchLocationData();
    }, []);

    useEffect(() => {
        const fetchShabbatInfo = async () => {
            if (!locationData) {
                return;
            }
            try {
                const queryParams = new URLSearchParams({
                    latitude: locationData.latitude.toString(),
                    longitude: locationData.longitude.toString(),
                    altitude: locationData.altitude.toString(),
                    timezone: locationData.timezone.toString(),
                });
                const url = `http://localhost:8000/api/shabbat/${today}?${queryParams}`;
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(
                        "Something went wrong fetching Shabbat info!"
                    );
                }
                const data = await response.json();
                console.log("shabinfo", data);
                setShabbatInfo(data);
            } catch (error) {
                console.error(
                    "Something went wrong fetching Shabbat info!",
                    error
                );
            }
        };
        fetchShabbatInfo();
    }, [locationData]);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollViewContent}>
                {fontsLoaded ? (
                    <View style={styles.frame}>
                        {shabbatInfo ? (
                            <>
                                <Text style={styles.mediumBoldText}>
                                    Erev Shabbat
                                </Text>
                                <View style={styles.list}>
                                    <Text style={styles.paragraphText}>
                                        Date
                                    </Text>
                                    {shabbatInfo.candleDate && (
                                        <Text style={styles.paragraphText}>
                                            {dateDisplay === "gregorian"
                                                ? shabbatInfo.candleDate
                                                : shabbatInfo.candleHDate}
                                        </Text>
                                    )}
                                </View>

                                <View style={styles.list}>
                                    <Text style={styles.paragraphText}>
                                        Candle Lighting
                                    </Text>
                                    {shabbatInfo.candleTime && (
                                        <Text style={styles.paragraphText}>
                                            {shabbatInfo.candleTime}
                                        </Text>
                                    )}
                                </View>

                                <View style={styles.list}>
                                    <Text style={styles.paragraphText}>
                                        Sundown
                                    </Text>
                                    {shabbatInfo.sundown && (
                                        <Text style={styles.paragraphText}>
                                            {shabbatInfo.sundown}
                                        </Text>
                                    )}
                                </View>
                                <View style={styles.spacer} />
                                <Text style={styles.mediumBoldText}>
                                    Yom Shabbat
                                </Text>

                                <View style={styles.list}>
                                    <Text style={styles.paragraphText}>
                                        Date
                                    </Text>
                                    {shabbatInfo.havdalahDate && (
                                        <Text style={styles.paragraphText}>
                                            {dateDisplay === "gregorian"
                                                ? shabbatInfo.havdalahDate
                                                : shabbatInfo.havdalahHDate}
                                        </Text>
                                    )}
                                </View>
                                <View style={styles.list}>
                                    <Text style={styles.paragraphText}>
                                        Havdalah
                                    </Text>
                                    {shabbatInfo.havdalahTime && (
                                        <Text style={styles.paragraphText}>
                                            {shabbatInfo.havdalahTime}
                                        </Text>
                                    )}
                                </View>
                                <View style={styles.spacer} />

                                <Text style={styles.mediumBoldText}>
                                    Parasha
                                </Text>
                                {shabbatInfo.parshaEnglish && (
                                    <Text style={styles.paragraphText}>
                                        {shabbatInfo.parshaEnglish}
                                    </Text>
                                )}
                                {shabbatInfo.parshaHebrew && (
                                    <Text style={styles.paragraphText}>
                                        {shabbatInfo.parshaHebrew}
                                    </Text>
                                )}
                            </>
                        ) : (
                            <Text style={styles.paragraphText}>
                                Loading Shabbat info...
                            </Text>
                        )}
                    </View>
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
        paddingTop: 40,
    },
    spacer: {
        marginBottom: 18,
    },
    mediumBoldText: {
        color: "#82CBFF",
        fontFamily: "Nayuki",
        fontSize: 42,
        marginBottom: 16,
    },
    list: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    paragraphText: {
        color: "white",
        fontSize: 20,
        marginBottom: 8,
    },
});
