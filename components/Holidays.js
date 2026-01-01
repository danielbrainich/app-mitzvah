import React, {
    Fragment,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import {
    StyleSheet,
    Text,
    SafeAreaView,
    View,
    ScrollView,
    RefreshControl,
} from "react-native";
import { useSelector } from "react-redux";
import { HebrewCalendar, HDate, Event } from "@hebcal/core";

const MONTHS = [
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
const MONTHS_SHORT = [
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

function formatDate(isoDate) {
    const date = new Date(isoDate);
    return `${date.getUTCDate()} ${
        MONTHS[date.getUTCMonth()]
    } ${date.getUTCFullYear()}`;
}

function formatShortDate(isoDate) {
    const date = new Date(isoDate);
    return `${date.getUTCDate()} ${
        MONTHS_SHORT[date.getUTCMonth()]
    } ${date.getUTCFullYear()}`;
}

function removeParentheses(text) {
    return text.replace(/\s*\([^)]*\)/g, "");
}

function msUntilNextLocalMidnight() {
    const now = new Date();
    const next = new Date(now);
    next.setDate(now.getDate() + 1);
    next.setHours(0, 0, 0, 0);
    return next.getTime() - now.getTime();
}

function collectUniqueHolidays(events) {
    const seen = new Set();
    const out = [];
    for (const ev of events) {
        if (ev instanceof Event) {
            const desc = ev.getDesc();
            if (!seen.has(desc)) {
                seen.add(desc);
                out.push(ev);
            }
        }
    }
    return out;
}

export default function Holidays() {
    const { dateDisplay, minorFasts, rosheiChodesh, modernHolidays } =
        useSelector((state) => state.settings);

    const [holidays, setHolidays] = useState([]);
    const [todayHolidays, setTodayHolidays] = useState([]);
    const [displayCount, setDisplayCount] = useState(4);
    const [refreshing, setRefreshing] = useState(false);

    const timeoutIdRef = useRef(null);
    const intervalIdRef = useRef(null);

    const todayIso = useMemo(() => new Date().toISOString().split("T")[0], []);

    const fetchHolidays = useCallback(() => {
        const startDate = new Date(todayIso);
        startDate.setDate(startDate.getDate() + 1);

        const endDate = new Date(todayIso);
        endDate.setMonth(endDate.getMonth() + 15);

        const options = {
            start: startDate,
            end: endDate,
            isHebrewYear: false,
            candlelighting: false,
            noMinorFast: !minorFasts,
            noSpecialShabbat: true,
            noModern: !modernHolidays,
            noRoshChodesh: !rosheiChodesh,
            sedrot: false,
            omer: false,
            shabbatMevarchim: false,
            molad: false,
            yomKippurKatan: false,
            locale: "he",
        };

        const events = HebrewCalendar.calendar(options);
        const unique = collectUniqueHolidays(events);

        const formatted = unique.map((ev) => {
            const gregIso = ev.getDate().greg().toISOString().split("T")[0];
            return {
                id: `${ev.getDesc()}-${gregIso}`,
                title: ev.getDesc(),
                hebrewTitle: ev.renderBrief("he-x-NoNikud"),
                date: gregIso,
                hebrewDate: ev.getDate().toString(),
                categories: ev.getCategories(),
            };
        });

        setHolidays(formatted);
        setTodayHolidays(formatted.filter((h) => h.date === todayIso));
    }, [todayIso, minorFasts, modernHolidays, rosheiChodesh]);

    useEffect(() => {
        // initial fetch
        fetchHolidays();

        // midnight refresh scheduling
        const schedule = () => {
            if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
            timeoutIdRef.current = setTimeout(() => {
                fetchHolidays();
                if (intervalIdRef.current) clearInterval(intervalIdRef.current);
                intervalIdRef.current = setInterval(
                    fetchHolidays,
                    24 * 60 * 60 * 1000
                );
            }, msUntilNextLocalMidnight());
        };

        schedule();

        return () => {
            if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
            if (intervalIdRef.current) clearInterval(intervalIdRef.current);
        };
    }, [fetchHolidays]);

    const handleRefresh = useCallback(() => {
        setRefreshing(true);
        setDisplayCount(4);
        fetchHolidays();
        // small delay for UX so the spinner is visible
        setTimeout(() => setRefreshing(false), 400);
    }, [fetchHolidays]);

    const upcoming = useMemo(
        () => holidays.filter((h) => h.date > todayIso),
        [holidays, todayIso]
    );

    const showMore = () => setDisplayCount((n) => n + 4);

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
                {todayHolidays.length > 0 ? (
                    <View style={styles.frame}>
                        <Text style={styles.headerText}>Today is</Text>

                        {todayHolidays.map((holiday, index) => (
                            <Fragment key={holiday.id}>
                                {index > 0 && (
                                    <Text style={styles.andText}>and</Text>
                                )}
                                <Text
                                    style={
                                        todayHolidays.length > 1
                                            ? styles.smallBoldText
                                            : styles.bigBoldText
                                    }
                                >
                                    {removeParentheses(holiday.title)}
                                </Text>
                                <Text style={styles.hebrewText}>
                                    {holiday.hebrewTitle}
                                </Text>
                            </Fragment>
                        ))}

                        <Text style={styles.dateText}>
                            {dateDisplay === "gregorian"
                                ? formatDate(todayIso)
                                : new HDate().toString()}
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
                                ? formatDate(todayIso)
                                : new HDate().toString()}
                        </Text>
                    </View>
                )}

                <View style={styles.frame}>
                    <Text style={styles.secondHeaderText}>Coming up</Text>

                    {upcoming.slice(0, displayCount).map((holiday) => (
                        <View key={holiday.id}>
                            <View style={styles.list}>
                                <Text style={styles.listText}>
                                    {removeParentheses(holiday.title)}
                                </Text>
                                <Text style={styles.listText}>
                                    {dateDisplay === "gregorian"
                                        ? formatShortDate(holiday.date)
                                        : holiday.hebrewDate}
                                </Text>
                            </View>
                            <View style={styles.blueLine} />
                        </View>
                    ))}

                    {displayCount < upcoming.length && (
                        <Text style={styles.showMoreText} onPress={showMore}>
                            Show More
                        </Text>
                    )}
                </View>
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
    smallBoldText: {
        color: "#82CBFF",
        fontFamily: "Nayuki",
        fontSize: 48,
        marginVertical: 4,
    },
    andText: {
        color: "white",
        fontSize: 24,
        marginBottom: 16,
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
