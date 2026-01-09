// components/screens/Holidays.js
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Text, View, ScrollView, Pressable } from "react-native";
import { useSelector } from "react-redux";
import { HebrewCalendar, HDate, Event } from "@hebcal/core";
import { useFonts } from "expo-font";
import * as Haptics from "expo-haptics";

import { ui } from "../../styles/theme";
import { getHolidayDetailsByName } from "../../utils/getHolidayDetails";
import { parseLocalIso } from "../../utils/datetime";
import useTodayIsoDay from "../../hooks/useTodayIsoDay";
import { DEBUG_TODAY_ISO } from "../../utils/debug";

import TodayHolidayCarousel from "../TodayHolidayCarousel";
import TodayHolidayCard from "../TodayHolidayCard";
import UpcomingHolidaysCarousel from "../UpcomingHolidaysCarousel";
import BottomSheetDrawer from "../BottomSheetDrawer";

/**
 * Date -> local YYYY-MM-DD (stable in local time; avoids UTC shifting).
 */
function toLocalIsoDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

/**
 * End range: day before the same Hebrew month/day next year.
 * Prevents “wraparound” duplicates from HebrewCalendar.
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

const TODAY_CARD_HEIGHT = 360;
const UPCOMING_HEIGHT = 120;

export default function Holidays() {
    const [fontsLoaded] = useFonts({
        ChutzBold: require("../../assets/fonts/Chutz-Bold.otf"),
    });

    const { minorFasts, rosheiChodesh, modernHolidays } = useSelector(
        (state) => state.settings
    );

    // ✅ single source of truth for “today”
    const todayIso = useTodayIsoDay(DEBUG_TODAY_ISO);

    const [holidays, setHolidays] = useState([]);
    const [todayHolidays, setTodayHolidays] = useState([]);

    // ✅ ONE drawer for the entire screen
    const [aboutOpen, setAboutOpen] = useState(false);
    const [aboutHoliday, setAboutHoliday] = useState(null);

    const openAbout = useCallback((holiday) => {
        if (!holiday) return;
        setAboutHoliday(holiday);
        setAboutOpen(true);
    }, []);

    const closeAbout = useCallback(() => setAboutOpen(false), []);

    // Fetch + format once whenever settings/today changes
    const fetchHolidays = useCallback(() => {
        const start = parseLocalIso(todayIso);
        const end = endOfHebrewYearFromTodayExclusive(todayIso);

        const events = HebrewCalendar.calendar({
            start,
            end,
            isHebrewYear: false,
            candlelighting: false,

            // feature toggles
            noMinorFast: !minorFasts,
            noSpecialShabbat: true,
            noModern: !modernHolidays,
            noRoshChodesh: !rosheiChodesh,

            // keep these off
            sedrot: false,
            omer: false,
            shabbatMevarchim: false,
            molad: false,
            yomKippurKatan: false,

            locale: "he",
        });

        const formatted = (events || [])
            .filter((ev) => ev instanceof Event)
            .map((ev) => {
                const gregIso = toLocalIsoDate(ev.getDate().greg());
                return {
                    id: `${ev.getDesc()}-${gregIso}`,
                    title: ev.getDesc(),
                    hebrewTitle: ev.renderBrief("he-x-NoNikud"),
                    date: gregIso,
                    hebrewDate: ev.getDate().toString(),
                    categories: ev.getCategories(),
                };
            });

        // Optional dev audit: descriptions coverage
        if (__DEV__) {
            const uniqueTitles = [...new Set(formatted.map((h) => h.title))];
            const missing = uniqueTitles.filter(
                (title) => !getHolidayDetailsByName(title)?.description
            );

            console.group(`[Holiday descriptions]`);
            console.log(`Unique titles: ${uniqueTitles.length}`);
            if (missing.length === 0)
                console.log("✅ All holidays have descriptions");
            else {
                console.warn(`❌ Missing ${missing.length} descriptions:`);
                missing.forEach((t) => console.warn("•", t));
            }
            console.groupEnd();
        }

        setHolidays(formatted);
        setTodayHolidays(formatted.filter((h) => h.date === todayIso));
    }, [todayIso, minorFasts, modernHolidays, rosheiChodesh]);

    useEffect(() => {
        fetchHolidays();
    }, [fetchHolidays]);

    const upcoming = useMemo(
        () => holidays.filter((h) => h.date > todayIso),
        [holidays, todayIso]
    );

    // ✅ simplest way to pass drawer behavior down:
    // Provide a CardComponent that injects `onAbout`.
    const TodayCard = useMemo(() => {
        return function TodayCardWithAbout(props) {
            return <TodayHolidayCard {...props} onAbout={openAbout} />;
        };
    }, [openAbout]);

    if (!fontsLoaded) return null;

    const oneToday = todayHolidays.length === 1;
    const manyToday = todayHolidays.length > 1;
    const singleHoliday = oneToday ? todayHolidays[0] : null;

    return (
        <View style={ui.container}>
            <ScrollView
                style={ui.screen}
                contentContainerStyle={[ui.scrollContent, { flexGrow: 1 }]}
            >
                <View style={{ flex: 1 }}>
                    {/* TODAY */}
                    {manyToday ? (
                        <View style={[ui.holidaysTodaySection, { flex: 1 }]}>
                            <TodayHolidayCarousel
                                data={todayHolidays}
                                height={TODAY_CARD_HEIGHT}
                                peek={42}
                                gap={18}
                                cardHeight={TODAY_CARD_HEIGHT}
                                CardComponent={TodayCard}
                            />
                        </View>
                    ) : oneToday ? (
                        // Single holiday: same centered style as “not a holiday”
                        <View style={[ui.holidaysTodaySection, { flex: 1 }]}>
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    paddingHorizontal: 22,
                                }}
                            >
                                <Text style={ui.holidaysHeaderText}>
                                    Today is
                                </Text>

                                <Text
                                    style={[
                                        ui.holidaysBigBoldText,
                                        {
                                            fontFamily: "ChutzBold",
                                        },
                                    ]}
                                >
                                    {singleHoliday.title}
                                </Text>

                                {singleHoliday.hebrewTitle && (
                                    <Text style={ui.todayHolidayHebrew}>
                                        {singleHoliday.hebrewTitle}
                                    </Text>
                                )}

                                <Pressable
                                    onPress={() => {
                                        Haptics.impactAsync(
                                            Haptics.ImpactFeedbackStyle.Light
                                        );
                                        openAbout(singleHoliday);
                                    }}
                                    style={ui.todayHolidayMoreInfoButton}
                                >
                                    <Text
                                        style={
                                            ui.todayHolidayMoreInfoButtonText
                                        }
                                    >
                                        About this holiday
                                    </Text>
                                </Pressable>
                            </View>
                        </View>
                    ) : (
                        // Not a holiday: centered
                        <View style={[ui.holidaysTodaySection, { flex: 1 }]}>
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    paddingHorizontal: 22,
                                }}
                            >
                                <Text style={ui.holidaysHeaderText}>
                                    Today is
                                </Text>
                                <Text
                                    style={[
                                        ui.holidaysBigBoldText,
                                        {
                                            fontFamily: "ChutzBold",
                                            textAlign: "center",
                                        },
                                    ]}
                                >
                                    not a Jewish holiday
                                </Text>
                            </View>
                        </View>
                    )}
                </View>

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
                            height={UPCOMING_HEIGHT}
                            peek={42}
                            onAbout={openAbout}
                        />
                    </View>
                </View>
            </ScrollView>

            {/* One drawer for the entire screen */}
            <BottomSheetDrawer
                visible={aboutOpen}
                onClose={closeAbout}
                title={aboutHoliday?.title ?? "About"}
                snapPoints={["35%", "55%"]}
            >
                <View style={{ paddingHorizontal: 18, paddingBottom: 18 }}>
                    {!!aboutHoliday?.hebrewTitle && (
                        <Text
                            style={{
                                opacity: 0.85,
                                marginBottom: 10,
                                textAlign: "center",
                            }}
                        >
                            {aboutHoliday.hebrewTitle}
                        </Text>
                    )}

                    <Text style={{ lineHeight: 20, opacity: 0.95 }}>
                        {aboutHoliday
                            ? getHolidayDetailsByName(aboutHoliday.title)
                                  ?.description ?? "No description available."
                            : ""}
                    </Text>
                </View>
            </BottomSheetDrawer>
        </View>
    );
}
