import React, {
    Fragment,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { StyleSheet, Text, SafeAreaView, View } from "react-native";
import { useSelector } from "react-redux";
import { HebrewCalendar, HDate, Event } from "@hebcal/core";
import { getHolidayDetailsByName } from "../../utils/getHolidayDetails";
import HolidayPager from "../HolidayPager";
import TodayHolidayCard from "../TodayHolidayCard";
import UpcomingHolidaysCarousel from "../UpcomingHolidaysCarousel";

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
//   • 1 holiday day: "2026-09-12"
//   • 2 holidays day: "2026-03-02"
//   • 3 holidays day: "2026-12-10"
const DEBUG_TODAY_ISO = __DEV__ ? "2026-12-10" : null;

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

        // checks that each holiday name is matched with a descriptiojn
        if (__DEV__) {
            const uniqueTitles = [...new Set(formatted.map((h) => h.title))];

            const missing = uniqueTitles.filter((title) => {
                const details = getHolidayDetailsByName(title);
                return !details?.description;
            });

            console.group(`[ONE-TIME CHECK] Holiday description coverage`);
            console.log(`Total unique titles: ${uniqueTitles.length}`);

            if (missing.length === 0) {
                console.log("✅ All holidays have descriptions");
            } else {
                console.warn(`❌ Missing ${missing.length} descriptions:`);
                missing.forEach((t) => console.warn("•", t));
            }

            console.groupEnd();
        }

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
        fetchHolidays();
        setTimeout(() => setRefreshing(false), 400);
    }, [fetchHolidays]);

    // Coming up should NOT include today
    const upcoming = useMemo(
        () => holidays.filter((h) => h.date > todayIso),
        [holidays, todayIso]
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.screen}>
                {/* TODAY */}
                {todayHolidays.length > 0 ? (
                    <View style={styles.todaySection}>
                        <Text style={styles.headerText}>Today is</Text>

                        <View style={styles.todayPagerSlot}>
                            <HolidayPager
                                data={todayHolidays}
                                dateDisplay={dateDisplay}
                                height={TODAY_PAGER_HEIGHT}
                                peek={0} // no peeking for Today
                                showDots // only shows dots if > 1
                                CardComponent={TodayHolidayCard}
                                todayIso={todayIso}
                                formatDate={formatDate}
                            />
                        </View>
                    </View>
                ) : (
                    <View style={styles.todaySection}>
                        <Text style={styles.headerText}>Today is</Text>

                        <View style={styles.todayPagerSlot}>
                            <View style={styles.noHolidayWrap}>
                                <Text style={styles.bigBoldText}>
                                    not a Jewish holiday
                                </Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* COMING UP (pinned to bottom) */}
                <View style={styles.comingUpSection}>
                    <Text style={styles.secondHeaderText}>Coming up</Text>

                    <View style={styles.upcomingCarouselSlot}>
                        <UpcomingHolidaysCarousel
                            holidays={upcoming}
                            dateDisplay={dateDisplay}
                            height={UPCOMING_HEIGHT}
                            peek={50}
                        />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const TODAY_PAGER_HEIGHT = 340;
const UPCOMING_HEIGHT = 120;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
    },

    screen: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 66,
        paddingBottom: 16,
    },

    headerText: {
        color: "white",
        fontSize: 30,
        marginBottom: 12,
    },

    todaySection: {
        flexShrink: 1,
    },

    todayPagerSlot: {
        height: TODAY_PAGER_HEIGHT,
        justifyContent: "flex-start",
        paddingTop: 6,
    },

    noHolidayWrap: {
        justifyContent: "center",
        alignItems: "flex-start",
    },

    bigBoldText: {
        color: "#82CBFF",
        fontFamily: "Nayuki",
        fontSize: 86,
        lineHeight: 90,
    },

    comingUpSection: {
        marginTop: "auto",
        paddingTop: 14,
    },

    secondHeaderText: {
        color: "white",
        fontSize: 20,
        marginBottom: 14,
    },

    upcomingCarouselSlot: {
        height: UPCOMING_HEIGHT,
    },
});
