import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import { parseLocalIso } from "../../utils/datetime";
import useTodayIsoDay from "../../hooks/useTodayIsoDay";
import { DEBUG_TODAY_ISO } from "../../utils/debug";

/**
 * Convert a Date -> local YYYY-MM-DD.
 * Why: consistent IDs + comparisons in local time.
 */
function localIsoDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

/**
 * Format an ISO date like: "January 5, 2026"
 * (You said you want this format everywhere.)
 */
function formatDate(isoDate) {
    const date = parseLocalIso(isoDate);
    return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

/**
 * End at: day before the same Hebrew month/day next year.
 * Why: prevent “wraparound” duplicates.
 */
function endOfHebrewYearFromTodayExclusive(todayIso) {
    const todayLocal = parseLocalIso(todayIso);
    const h = new HDate(todayLocal);

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
        ChutzBold: require("../../assets/fonts/Chutz-Bold.otf"),
    });

    const { hebrewDate, minorFasts, rosheiChodesh, modernHolidays } =
        useSelector((state) => state.settings);

    // Centralized local “today”, auto-updates at midnight.
    const todayIso = useTodayIsoDay(DEBUG_TODAY_ISO);

    const [holidays, setHolidays] = useState([]);
    const [todayHolidays, setTodayHolidays] = useState([]);

    const fetchHolidays = useCallback(() => {
        const startDate = parseLocalIso(todayIso);
        const endDate = endOfHebrewYearFromTodayExclusive(todayIso);

        const options = {
            start: startDate,
            end: endDate,
            isHebrewYear: false,
            candlelighting: false,

            // feature toggles
            noMinorFast: !minorFasts,
            noSpecialShabbat: true,
            noModern: !modernHolidays,
            noRoshChodesh: !rosheiChodesh,

            // keep these off (as in your original)
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

        // DEV: verify every holiday name has a description
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

        setHolidays(formatted);
        setTodayHolidays(formatted.filter((h) => h.date === todayIso));
    }, [todayIso, minorFasts, modernHolidays, rosheiChodesh]);

    // No timers here anymore — the hook flips todayIso at midnight.
    useEffect(() => {
        fetchHolidays();
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
                                        { fontFamily: "ChutzBold" },
                                    ]}
                                >
                                    not a Jewish holiday
                                </Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* COMING UP */}
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
