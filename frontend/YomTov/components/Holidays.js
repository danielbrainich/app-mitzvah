import { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    SafeAreaView,
    View,
    ScrollView,
    RefreshControl,
} from "react-native";
import { useFonts } from "expo-font";
import { useSelector } from "react-redux";
import { HebrewCalendar, HDate, Event } from "@hebcal/core";

export default function Holidays() {
    const [holidays, setHolidays] = useState([]);
    const [fontsLoaded] = useFonts({
        Nayuki: require("../assets/fonts/NayukiRegular.otf"),
    });
    const dateDisplay = useSelector((state) => state.dateDisplay);
    const [isTodayHoliday, setIsTodayHoliday] = useState(null);
    const today = new Date().toISOString().split("T")[0];
    // const today = "2024-12-29";
    const [displayCount, setDisplayCount] = useState(4);
    const [refreshing, setRefreshing] = useState(false);

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
        const fetchHolidays = () => {
            const startDate = new Date(today);
            startDate.setDate(startDate.getDate() + 1);
            let endDate = new Date(today);
            endDate.setMonth(endDate.getMonth() + 15);

            const options = {
                start: startDate,
                end: endDate,
                isHebrewYear: false,
                candlelighting: false,
                noMinorFast: true,
                noSpecialShabbat: true,
                noModern: false,
                noRoshChodesh: true,
                sedrot: false,
                omer: false,
                shabbatMevarchim: false,
                molad: false,
                yomKippurKatan: false,
                locale: "he",
            };

            const events = HebrewCalendar.calendar(options);
            const uniqueHolidays = collectUniqueHolidays(events);

            const formattedEvents = uniqueHolidays.map((ev) => ({
                title: ev.getDesc(),
                hebrewTitle: ev.renderBrief("he-x-NoNikud"),
                date: ev.getDate().greg().toISOString().split("T")[0],
                hebrewDate: ev.getDate().toString(),
                categories: ev.getCategories(),
            }));

            setHolidays(formattedEvents);
            checkIfTodayIsHoliday(formattedEvents);
        };

        fetchHolidays();
    }, [refreshing]);

    function collectUniqueHolidays(events) {
        const seenHolidays = new Set();
        const collectedHolidays = [];

        for (const event of events) {
            if (event instanceof Event && !seenHolidays.has(event.getDesc())) {
                seenHolidays.add(event.getDesc());
                collectedHolidays.push(event);
            }
        }
        return collectedHolidays;
    }

    function handleShowMore() {
        setDisplayCount((prevCount) => prevCount + 4);
    }

    const handleRefresh = () => {
        setRefreshing(true);
        setDisplayCount(4);
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.scrollViewContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                    />
                }
            >
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
                                <Text style={styles.dateText}>
                                    {dateDisplay === "gregorian"
                                        ? formatDate(today)
                                        : new HDate().toString()}
                                </Text>
                            </View>
                        )}
                        <View style={styles.frame}>
                            <Text style={styles.secondHeaderText}>
                                Coming up
                            </Text>
                            {holidays
                                .filter((holiday) => {
                                    return holiday.date > today;
                                })
                                .slice(0, displayCount)
                                .map((holiday, index) => (
                                    <View key={`holiday-${index}`}>
                                        <View style={styles.list}>
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
                                        <View style={styles.blueLine}></View>
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
