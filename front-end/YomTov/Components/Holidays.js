import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, SafeAreaView, View } from "react-native";
import { useFonts } from "expo-font";
import Swiper from "react-native-swiper";

export default function Holidays() {
    const [holidays, setHolidays] = useState([]);
    const [fontsLoaded] = useFonts({
        Nayuki: require("../assets/fonts/NayukiRegular.otf"),
    });

    function formatDate(inputDate) {
        const date = new Date(inputDate);
        return date.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    }

    useEffect(() => {
        const fetchHolidays = async () => {
            const date = new Date().toISOString().split("T")[0];
            try {
                const response = await fetch(
                    `http://localhost:8000/api/holidays/${date}`
                );
                if (!response.ok) {
                    throw new Error(
                        "Something went wrong fetching holiday info!"
                    );
                }
                const data = await response.json();
                console.log(data);
                setHolidays(data);
            } catch (error) {
                console.error(
                    "Something went wrong fetching holiday info!",
                    error
                );
            }
        };

        fetchHolidays();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            {fontsLoaded ? (
                <Swiper
                    style={styles.wrapper}
                    showsButtons={false}
                    loop={false}
                    dot={<View style={styles.dot} />}
                    activeDot={<View style={styles.activeDot} />}
                    index={1}
                >
                    <View style={styles.frame}>
                        {holidays?.holiday_info?.previous ? (
                            <View>
                                <Text style={styles.headerText}>
                                    Previous holiday
                                </Text>
                                <Text style={styles.bigBoldText}>
                                    {holidays.holiday_info.previous.title}
                                </Text>
                                <Text style={styles.hebrewText}>
                                    {holidays.holiday_info.previous.hebrew}
                                </Text>
                                <Text style={styles.dateText}>
                                    {formatDate(
                                        holidays.holiday_info.previous.date
                                    )}
                                </Text>
                                <Text style={styles.paragraphText}>
                                    {holidays.holiday_info.previous.memo}
                                </Text>
                            </View>
                        ) : (
                            <View>
                                <Text style={styles.headerText}>
                                    Error loading
                                </Text>
                                <Text style={styles.bigBoldText}>
                                    previous Jewish holiday
                                </Text>
                            </View>
                        )}
                    </View>
                    <View style={styles.frame}>
                        {holidays?.holiday_info?.today ? (
                            <View>
                                <Text style={styles.headerText}>Today is</Text>
                                <Text style={styles.bigBoldText}>
                                    {holidays.holiday_info.today.title}
                                </Text>
                                <Text style={styles.hebrewText}>
                                    {holidays.holiday_info.today.hebrew}
                                </Text>
                                <Text style={styles.dateText}>
                                    {formatDate(
                                        holidays.holiday_info.today.date
                                    )}
                                </Text>
                                <Text style={styles.paragraphText}>
                                    {holidays.holiday_info.today.memo}
                                </Text>
                            </View>
                        ) : (
                            <View>
                                <Text style={styles.headerText}>Today is</Text>
                                <Text style={styles.bigBoldText}>
                                    not a Jewish holiday
                                </Text>
                            </View>
                        )}
                    </View>
                    <View style={styles.frame}>
                        {holidays?.holiday_info?.next ? (
                            <View>
                                <Text style={styles.headerText}>
                                    Upcoming holiday
                                </Text>
                                <Text style={styles.bigBoldText}>
                                    {holidays.holiday_info.next.title}
                                </Text>
                                <Text style={styles.hebrewText}>
                                    {holidays.holiday_info.next.hebrew}
                                </Text>
                                <Text style={styles.dateText}>
                                    {formatDate(
                                        holidays.holiday_info.next.date
                                    )}
                                </Text>
                                <Text style={styles.paragraphText}>
                                    {holidays.holiday_info.next.memo}
                                </Text>
                            </View>
                        ) : (
                            <View>
                                <Text style={styles.headerText}>
                                    Error loading
                                </Text>
                                <Text style={styles.bigBoldText}>
                                    next Jewish holiday
                                </Text>
                            </View>
                        )}
                    </View>
                </Swiper>
            ) : (
                <AppLoading />
            )}
            <StatusBar style="auto" />
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
    frame: {
        padding: 20,
    },
    headerText: {
        color: "#82CBFF",
        fontSize: 32,
        marginBottom: 22,
    },
    bigBoldText: {
        color: "white",
        fontFamily: "Nayuki",
        fontSize: 84,
        marginBottom: 2,
    },
    hebrewText: {
        color: "#82CBFF",
        fontSize: 44,
        marginBottom: 18,
    },
    dateText: {
        color: "#82CBFF",
        fontSize: 24,
        marginBottom: 24,
    },
    paragraphText: {
        color: "white",
        fontSize: 26,
    },
    dot: {
        backgroundColor: "white",
        width: 10,
        height: 10,
        borderRadius: 5,
        margin: 3,
    },
    activeDot: {
        backgroundColor: "#82CBFF",
        width: 10,
        height: 10,
        borderRadius: 5,
        margin: 3,
    },
});
