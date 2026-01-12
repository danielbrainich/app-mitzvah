// screens/Holidays.js
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Text, View, ScrollView, Pressable } from "react-native";
import { useSelector } from "react-redux";
import { HebrewCalendar, HDate, Event } from "@hebcal/core";
import { useFonts } from "expo-font";
import * as Haptics from "expo-haptics";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Entypo } from "@expo/vector-icons";

import { ui } from "../../styles/theme";
import { getHolidayDetailsByName } from "../../utils/getHolidayDetails";
import { parseLocalIso, formatGregorianLong } from "../../utils/datetime";
import useTodayIsoDay from "../../hooks/useTodayIsoDay";
import { DEBUG_TODAY_ISO } from "../../utils/debug";

import UpcomingHolidaysCarousel from "../UpcomingHolidaysCarousel";
import HolidayBottomSheet from "../HolidayBottomSheet";

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

const TODAY_STACK_HEIGHT = 360;
const UPCOMING_HEIGHT = 120;

/**
 * Slim "Today" card for 2–3 holidays.
 * - English (left)
 * - Hebrew (below, centered)
 * - three vertical dots on the right to open About
 * Uses existing styles only.
 */
function TodayHolidaySlimCard({ holiday, onAbout }) {
    if (!holiday) return null;

    const title = holiday.title ?? "";
    const hebrewTitle = holiday.hebrewTitle ?? "";

    return (
        <View style={ui.upcomingHolidayCard}>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 12,
                }}
            >
                <View style={{ flex: 1 }}>
                    <Text
                        style={[
                            ui.upcomingHolidayTitle,
                            { fontFamily: "ChutzBold" },
                        ]}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                    >
                        {title}
                    </Text>
                </View>

                <Pressable
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        onAbout?.(holiday);
                    }}
                    hitSlop={12}
                    style={{
                        width: 34,
                        height: 34,
                        borderRadius: 17,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "rgba(255,255,255,0.06)",
                    }}
                    accessibilityRole="button"
                    accessibilityLabel="More info"
                >
                    <Entypo
                        name="dots-three-vertical"
                        size={16}
                        color="white"
                    />
                </Pressable>
            </View>

            {!!hebrewTitle && (
                <Text
                    style={[
                        ui.upcomingHolidayHebrew,
                        { textAlign: "left", marginTop: 6 },
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {hebrewTitle}
                </Text>
            )}
        </View>
    );
}

function TodayHolidayStack({ holidays, height, onAbout }) {
    const list = (holidays || []).filter(Boolean);
    if (list.length < 2) return null;

    const gap = 14;

    return (
        <View style={{ height, justifyContent: "center" }}>
            <View style={{ gap }}>
                {list.slice(0, 3).map((h) => (
                    <TodayHolidaySlimCard
                        key={h.id ?? `${h.title}-${h.date}`}
                        holiday={h}
                        onAbout={onAbout}
                    />
                ))}
            </View>
        </View>
    );
}

export default function Holidays() {
    const [fontsLoaded] = useFonts({
        ChutzBold: require("../../assets/fonts/Chutz-Bold.otf"),
    });

    const { minorFasts, rosheiChodesh, modernHolidays } = useSelector(
        (state) => state.settings
    );

    const todayIso = useTodayIsoDay(DEBUG_TODAY_ISO);

    const [holidays, setHolidays] = useState([]);
    const [todayHolidays, setTodayHolidays] = useState([]);

    const [aboutOpen, setAboutOpen] = useState(false);
    const [aboutHoliday, setAboutHoliday] = useState(null);

    const openAbout = useCallback((holiday) => {
        if (!holiday) return;
        setAboutHoliday(holiday);
        requestAnimationFrame(() => setAboutOpen(true));
    }, []);

    const closeAbout = useCallback(() => setAboutOpen(false), []);

    const tabBarHeight = useBottomTabBarHeight();

    const fetchHolidays = useCallback(() => {
        const start = parseLocalIso(todayIso);
        const end = endOfHebrewYearFromTodayExclusive(todayIso);

        const events = HebrewCalendar.calendar({
            start,
            end,
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

    if (!fontsLoaded) return null;

    const oneToday = todayHolidays.length === 1;
    const manyToday = todayHolidays.length > 1;
    const singleHoliday = oneToday ? todayHolidays[0] : null;

    return (
        <View style={ui.container}>
            <ScrollView
                style={ui.screen}
                contentContainerStyle={[
                    ui.scrollContent,
                    { flexGrow: 1, paddingBottom: tabBarHeight + 16 },
                ]}
            >
                <View style={{ flex: 1 }}>
                    {/* TODAY */}
                    {manyToday ? (
                        <View style={[ui.holidaysTodaySection, { flex: 1 }]}>
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: "top", //
                                }}
                            >
                                <Text style={ui.holidaysHeaderText}>
                                    Today is
                                </Text>

                                <View style={{ marginTop: 12 }}>
                                    <TodayHolidayStack
                                        holidays={todayHolidays}
                                        onAbout={openAbout}
                                    />
                                </View>
                            </View>
                        </View>
                    ) : oneToday ? (
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
                                        { fontFamily: "ChutzBold" },
                                    ]}
                                >
                                    {singleHoliday?.title ?? ""}
                                </Text>

                                {singleHoliday?.hebrewTitle && (
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

            <HolidayBottomSheet
                visible={aboutOpen}
                onClose={closeAbout}
                dateLeft={
                    aboutHoliday?.date
                        ? formatGregorianLong(parseLocalIso(aboutHoliday.date))
                        : ""
                }
                dateRight={aboutHoliday?.hebrewDate ?? ""}
                nameLeft={aboutHoliday?.title ?? ""}
                nameRight={aboutHoliday?.hebrewTitle ?? ""}
                description={
                    aboutHoliday
                        ? getHolidayDetailsByName(aboutHoliday.title)
                              ?.description ?? "No description available."
                        : ""
                }
                snapPoints={["35%", "65%"]}
            />
        </View>
    );
}
