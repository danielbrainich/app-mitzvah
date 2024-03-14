import { useState, useEffect } from "react";
import { StyleSheet, Text, SafeAreaView, View, ScrollView } from "react-native";
import { useFonts } from "expo-font";
import { useSelector } from "react-redux";

export default function Holidays() {
    const [holidays, setHolidays] = useState([]);
    const [fontsLoaded] = useFonts({
        Nayuki: require("../assets/fonts/NayukiRegular.otf"),
    });
    const dateDisplay = useSelector((state) => state.dateDisplay);
    const [isTodayHoliday, setIsTodayHoliday] = useState(null);

    function formatDate(inputDate) {
        const date = new Date(inputDate);
        return date.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    }

    function checkIfTodayIsHoliday(holidays) {
        const today = new Date().toISOString().split("T")[0];
        const todayHoliday = holidays.find((holiday) => holiday.date === today);
        setIsTodayHoliday(todayHoliday || null);
    }

    function removeParentheses(text) {
        return text.replace(/\s*\([^)]*\)/g, '');
    }

    useEffect(() => {
        const fetchHolidays = async () => {
            const date = new Date().toISOString().split("T")[0];
            try {
                const response = await fetch(
                    `http://localhost:8000/api/holidays/2024-03-25`
                );
                if (!response.ok) {
                    throw new Error(
                        "Something went wrong fetching holiday info!"
                    );
                }
                const data = await response.json();
                console.log(data);
                setHolidays(data);
                checkIfTodayIsHoliday(data);
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
                        {isTodayHoliday ? (
                            <View style={styles.frame}>
                                <Text style={styles.headerText}>Today is</Text>
                                <Text style={styles.bigBoldText}>
                                    {removeParentheses(isTodayHoliday.title)}
                                </Text>
                                <Text style={styles.hebrewText}>
                                    {isTodayHoliday.hebrewDate}
                                </Text>
                                <Text style={styles.dateText}>
                                    {formatDate(isTodayHoliday.date)}
                                </Text>
                            </View>
                        ) : (
                            <View style={styles.frame}>
                                <Text style={styles.headerText}>
                                    Today is
                                </Text>
                                <Text style={styles.bigBoldText}>
                                    not a Jewish holiday
                                </Text>
                            </View>
                        )}
                        <View style={styles.frame}>
                        <Text style={styles.headerText}>Coming up</Text>
                        {holidays.map((holiday, index) => (
                            <View key={index} style={styles.card}>
                                <Text style={styles.cardBigBoldText}>
                                {removeParentheses(holiday.title)}
                                </Text>
                                <Text style={styles.cardDateText}>
                                    {dateDisplay === "gregorian"
                                        ? formatDate(holiday.date)
                                        : holiday.hebrewDate}
                                </Text>
                            </View>
                        ))}
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
        borderRadius: 8,
        marginTop: 20,
        marginBottom: 20,
        height: 175,
        justifyContent: "space-between",
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
