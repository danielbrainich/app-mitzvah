import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { HebrewCalendar, HDate, Event } from "@hebcal/core";
import { useFonts } from "expo-font";

import { ui } from "../../styles/theme";

import { getHolidayDetailsByName } from "../../utils/getHolidayDetails";
import TodayHolidayCarousel from "../TodayHolidayCarousel";
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
const DEBUG_TODAY_ISO = __DEV__ ? "2026-03-02" : null;

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

const TODAY_PAGER_HEIGHT = 340;
const UPCOMING_HEIGHT = 120;

export default function Holidays() {
    const [fontsLoaded] = useFonts({
        Nayuki: require("../../assets/fonts/NayukiRegular.otf"),
    });

    const { hebrewDate, minorFasts, rosheiChodesh, modernHolidays } =
        useSelector((state) => state.settings);

    const [holidays, setHolidays] = useState([]);
    const [todayHolidays, setTodayHolidays] = useState([]);

    const timeoutIdRef = useRef(null);
    const intervalIdRef = useRef(null);

    // Determines "today" using the local calendar date.
    // In development, DEBUG_TODAY_ISO can override this to simulate specific dates.
    const todayIso = useMemo(() => DEBUG_TODAY_ISO ?? localIsoToday(), []);

    const fetchHolidays = useCallback(() => {
        const startDate = parseLocalIso(todayIso);
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

        // checks that each holiday name is matched with a description
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

    // Coming up should NOT include today
    const upcoming = useMemo(
        () => holidays.filter((h) => h.date > todayIso),
        [holidays, todayIso]
    );

    if (!fontsLoaded) return null;

    return (
        <SafeAreaView style={ui.container}>
            <ScrollView
                style={ui.screen}
                contentContainerStyle={ui.scrollContent}
            >
                {/* TODAY */}
                {todayHolidays.length > 0 ? (
                    <View style={ui.holidaysTodaySection}>
                        <TodayHolidayCarousel
                            data={todayHolidays}
                            height={360}
                            peek={42}
                            gap={18}
                            CardComponent={TodayHolidayCard}
                            hebrewDate={hebrewDate}
                            formatDate={formatDate}
                            todayIso={todayIso}
                            cardHeight={360}
                        />
                    </View>
                ) : (
                    <View style={ui.holidaysTodaySection}>
                        <Text style={ui.holidaysHeaderText}>Today is</Text>

                        <View
                            style={[
                                ui.holidaysTodayPagerSlot,
                                { height: TODAY_PAGER_HEIGHT },
                            ]}
                        >
                            <View style={ui.holidaysNoHolidayWrap}>
                                <Text
                                    style={[
                                        ui.holidaysBigBoldText,
                                        { fontFamily: "Nayuki" },
                                    ]}
                                >
                                    not a Jewish holiday
                                </Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* COMING UP (pinned to bottom) */}
                <View style={ui.holidaysComingUpSection}>
                    <Text style={ui.holidaysSecondHeaderText}>Coming up</Text>

                    <View
                        style={[
                            ui.holidaysUpcomingCarouselSlot,
                            { height: UPCOMING_HEIGHT },
                        ]}
                    >
                        <UpcomingHolidaysCarousel
                            holidays={upcoming}
                            hebrewDate={hebrewDate}
                            height={UPCOMING_HEIGHT}
                            peek={42}
                            formatDate={formatDate}
                            todayIso={todayIso}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
