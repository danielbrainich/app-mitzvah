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
    // const today = new Date().toISOString().split("T")[0];
    const today = "2024-12-29";
    const [displayCount, setDisplayCount] = useState(4);

    function formatDate(inputDate) {
        const date = new Date(inputDate);
        const day = date.getUTCDate();
        const month = getMonthName(date.getUTCMonth());
        const year = date.getUTCFullYear();

        return `${day} ${month} ${year}`;
    }

    function formatShortDate(inputDate) {
        const date = new Date(inputDate);
        const day = date.getUTCDate();
        const month = getShortMonthName(date.getUTCMonth());
        const year = date.getUTCFullYear();

        return `${day} ${month} ${year}`;
    }

    function getMonthName(monthIndex) {
        const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];

        return monthNames[monthIndex];
    }

    function getShortMonthName(monthIndex) {
        const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];

        return monthNames[monthIndex];
    }

    function checkIfTodayIsHoliday(holidays) {
        const todayHoliday = holidays.find((holiday) => holiday.date === today);
        setIsTodayHoliday(todayHoliday || null);
    }

    function removeParentheses(text) {
        return text.replace(/\s*\([^)]*\)/g, "");
    }

    useEffect(() => {
        const fetchHolidays = async () => {
            const date = new Date().toISOString().split("T")[0];
            try {
                const response = await fetch(
                    `http://localhost:8000/api/holidays/${today}`
                );
                if (!response.ok) {
                    throw new Error(
                        "Something went wrong fetching holiday info!"
                    );
                }
                const data = await response.json();
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

    function handleShowMore() {
        setDisplayCount((prevCount) => prevCount + 4);
    }

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
                                    {isTodayHoliday.hebrewTitle}
                                </Text>
                                <Text style={styles.dateText}>
                                    {dateDisplay === "gregorian"
                                        ? formatDate(isTodayHoliday.date)
                                        : isTodayHoliday.hebrewDate}
                                </Text>
                            </View>
                        ) : (
                            <View style={styles.frame}>
                                <Text style={styles.headerText}>Today is</Text>
                                <Text style={styles.bigBoldText}>
                                    not a Jewish holiday
                                </Text>
                            </View>
                        )}
                        <View style={styles.frame}>
                            <Text style={styles.secondHeaderText}>
                                Coming up
                            </Text>
                            {holidays

                                .filter((holiday) => holiday.date > today)
                                .slice(0, displayCount)
                                .map((holiday, index) => (
                                    <View key={`holiday-${index}`}>
                                        <View key={index} style={styles.list}>
                                            <Text style={styles.listText}>
                                                {removeParentheses(
                                                    holiday.title
                                                )}
                                            </Text>
                                            <Text style={styles.listText}>
                                                {dateDisplay === "gregorian"
                                                    ? formatShortDate(
                                                          holiday.date
                                                      )
                                                    : holiday.hebrewDate}
                                            </Text>
                                        </View>
                                        <View
                                            key={`line-${index}`}
                                            style={styles.blueLine}
                                        ></View>
                                    </View>
                                ))}
                            {displayCount < holidays.length && (
                                <Text
                                    style={styles.showMoreText}
                                    onPress={handleShowMore}
                                >
                                    Show More
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
    list: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    blueLine: {
        height: 1,
        backgroundColor: "#82CBFF",
        marginTop: 2,
        marginBottom: 18,
    },
    scrollViewContent: {
        flex: 1,
        alignSelf: "stretch",
    },
    frame: {
        padding: 20,
        paddingTop: 40,
    },
    headerText: {
        color: "white",
        fontSize: 30,
        marginBottom: 16,
    },
    secondHeaderText: {
        color: "#82CBFF",
        fontSize: 24,
        marginBottom: 30,
    },
    bigBoldText: {
        color: "#82CBFF",
        fontFamily: "Nayuki",
        fontSize: 72,
    },
    hebrewText: {
        color: "#82CBFF",
        fontSize: 38,
        marginBottom: 12,
    },
    dateText: {
        color: "white",
        fontSize: 22,
        marginBottom: 16,
    },
    paragraphText: {
        color: "white",
        fontSize: 24,
    },
    listText: {
        color: "white",
        fontSize: 16,
    },
    showMoreText: {
        color: "#82CBFF",
        fontSize: 16,
        marginTop: 6,
        fontWeight: "bold",
    },
});
