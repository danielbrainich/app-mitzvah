import { useState, useEffect } from "react";
import { StyleSheet, Text, SafeAreaView, View, ScrollView } from "react-native";
import { useFonts } from "expo-font";

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
            <ScrollView style={styles.scrollViewContent}>
                {fontsLoaded ? (
                    <>
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

                        <View style={styles.card}>
                            {holidays?.holiday_info?.previous ? (
                                <View>
                                    <Text style={styles.cardHeaderText}>
                                        Previous holiday
                                    </Text>
                                    <Text style={styles.cardBigBoldText}>
                                        {holidays.holiday_info.previous.title}
                                    </Text>
                                    <Text style={styles.cardHebrewText}>
                                        {holidays.holiday_info.previous.hebrew}
                                    </Text>
                                    <Text style={styles.cardDateText}>
                                        {formatDate(
                                            holidays.holiday_info.previous.date
                                        )}
                                    </Text>
                                </View>
                            ) : (
                                <View>
                                    <Text style={styles.cardHeaderText}>
                                        Error loading
                                    </Text>
                                    <Text style={styles.cardBigBoldText}>
                                        previous Jewish holiday
                                    </Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.card}>
                            {holidays?.holiday_info?.next ? (
                                <View>
                                    <Text style={styles.cardHeaderText}>
                                        Upcoming holiday
                                    </Text>
                                    <Text style={styles.cardBigBoldText}>
                                        {holidays.holiday_info.next.title}
                                    </Text>
                                    <Text style={styles.cardHebrewText}>
                                        {holidays.holiday_info.next.hebrew}
                                    </Text>
                                    <Text style={styles.cardDateText}>
                                        {formatDate(
                                            holidays.holiday_info.next.date
                                        )}
                                    </Text>
                                </View>
                            ) : (
                                <View>
                                    <Text style={styles.cardHeaderText}>
                                        Error loading
                                    </Text>
                                    <Text style={styles.cardBigBoldText}>
                                        next Jewish holiday
                                    </Text>
                                </View>
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
        fontSize: 26,
    },
    cardBigBoldText: {
        color: "black",
        fontFamily: "Nayuki",
        fontSize: 72,
        marginBottom: 2,
    },
    cardHebrewText: {
        color: "black",
        fontSize: 38,
        marginBottom: 18,
    },
    cardDateText: {
        color: "black",
        fontSize: 22,
        marginBottom: 24,
    },
    headerText: {
        color: "white",
        fontSize: 26,
        marginBottom: 22,
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
