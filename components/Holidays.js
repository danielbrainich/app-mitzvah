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

// DEV ONLY: set to "YYYY-MM-DD" to simulate a date. Set to null for real today.
const DEBUG_TODAY_ISO = null; // e.g. "2026-09-12"

function localIsoDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

function localIsoToday() {
    const d = new Date();
    return localIsoDate(d);
}

// Parse YYYY-MM-DD as a LOCAL date (avoids UTC shifting)
function parseLocalIso(iso) {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d, 0, 0, 0, 0);
}

function formatDate(isoDate) {
    const date = parseLocalIso(isoDate);
    return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

function formatShortDate(isoDate) {
    const date = parseLocalIso(isoDate);
    return `${date.getDate()} ${
        MONTHS_SHORT[date.getMonth()]
    } ${date.getFullYear()}`;
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

// End at: day before the same Hebrew month/day next year
function endOfHebrewYearFromTodayExclusive(todayIso) {
    const [y, m, d] = todayIso.split("-").map(Number);
    const todayLocal = new Date(y, m - 1, d, 0, 0, 0, 0);

    const h = new HDate(todayLocal);

    // Same Hebrew day/month next Hebrew year
    const sameHebDateNextYear = new HDate(
        h.getDate(),
        h.getMonth(),
        h.getFullYear() + 1
    ).greg();

    const end = new Date(sameHebDateNextYear);
    end.setDate(end.getDate() - 1);
    end.setHours(23, 59, 59, 999);
    return end;
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

    // Determines "today" using the local calendar date.
    // In development, DEBUG_TODAY_ISO can override this to simulate specific dates
    // (e.g. holidays) without changing the device clock.
    // In production, this always resolves to the user's real local day.
    const todayIso = useMemo(() => DEBUG_TODAY_ISO ?? localIsoToday(), []);

    const fetchHolidays = useCallback(() => {
        // Include today so "Today is" can work
        const startDate = parseLocalIso(todayIso);

        // Cut off after one full Hebrew year from today (prevents “wraparound” repeats)
        const endDate = endOfHebrewYearFromTodayExclusive(todayIso);

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

        const formatted = events
            .filter((ev) => ev instanceof Event)
            .map((ev) => {
                const gregIso = localIsoDate(ev.getDate().greg());
                return {
                    id: `${ev.getDesc()}-${gregIso}`,
                    title: ev.getDesc(),
                    hebrewTitle: ev.renderBrief("he-x-NoNikud"),
                    date: gregIso,
                    hebrewDate: ev.getDate().toString(),
                    categories: ev.getCategories(),
                };
            });

        if (__DEV__) {
            console.group(
                `[Holidays] ${formatted.length} holidays starting ${todayIso} (1 Hebrew year window)`
            );
            formatted.forEach((h, i) => {
                console.log(
                    `${String(i + 1).padStart(2, "0")}. ${h.title} — ${
                        h.date
                    } (${h.hebrewDate})`
                );
            });
            console.groupEnd();
        }

        setHolidays(formatted);
        setTodayHolidays(formatted.filter((h) => h.date === todayIso));
    }, [todayIso, minorFasts, modernHolidays, rosheiChodesh]);

    useEffect(() => {
        fetchHolidays();

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
        setTimeout(() => setRefreshing(false), 400);
    }, [fetchHolidays]);

    // Coming up should NOT include today
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
