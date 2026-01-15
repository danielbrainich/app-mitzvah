import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Text, View, ScrollView, Pressable } from "react-native";
import { useSelector } from "react-redux";
import { useFonts } from "expo-font";
import * as Haptics from "expo-haptics";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import { ui } from "../../styles/theme";
import { getHolidayDetailsByName } from "../../utils/getHolidayDetails";
import { parseLocalIso, formatGregorianLong } from "../../utils/datetime";
import useTodayIsoDay from "../../hooks/useTodayIsoDay";

import UpcomingHolidaysCarousel from "../UpcomingHolidaysCarousel";
import HolidayBottomSheet from "../HolidayBottomSheet";
import TodayHolidayCarousel from "../TodayHolidayCarousel";
import { computeHolidaysInfo } from "../../lib/computeHolidaysinfo"

const TODAY_PAGER_HEIGHT = 420;
const UPCOMING_HEIGHT = 120;

/**
 * The “single holiday” hero layout as a reusable slide.
 */
function TodayHolidayHeroSlide({ holiday, onAbout }) {
    if (!holiday) return null;

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 22,
            }}
        >
            <Text style={ui.holidaysHeaderText}>Today is</Text>

            <Text style={[ui.holidaysBigBoldText, { fontFamily: "ChutzBold" }]}>
                {holiday.title ?? ""}
            </Text>

            {holiday.hebrewTitle ? (
                <Text style={ui.todayHolidayHebrew}>{holiday.hebrewTitle}</Text>
            ) : null}

            <Pressable
                onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    onAbout?.(holiday);
                }}
                style={ui.todayHolidayMoreInfoButton}
            >
                <Text style={ui.todayHolidayMoreInfoButtonText}>
                    About this holiday
                </Text>
            </Pressable>
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

    const todayIso = useTodayIsoDay();

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

    // compute in one place, set state (same behavior as before)
    const fetchHolidays = useCallback(() => {
        const { holidays: all, todayHolidays: today } = computeHolidaysInfo({
            todayIso,
            settings: { minorFasts, rosheiChodesh, modernHolidays },
        });

        setHolidays(all);
        setTodayHolidays(today);
    }, [todayIso, minorFasts, rosheiChodesh, modernHolidays]);

    useEffect(() => {
        fetchHolidays();
    }, [fetchHolidays]);

    // Keep upcoming derived (same as before, just cleaner)
    const upcoming = useMemo(
        () => holidays.filter((h) => h.date > todayIso),
        [holidays, todayIso]
    );

    if (!fontsLoaded) return null;

    const todayItems = todayHolidays;
    const oneToday = todayItems.length === 1;
    const manyToday = todayItems.length > 1;
    const singleHoliday = oneToday ? todayItems[0] : null;

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
                                style={[
                                    ui.holidaysTodayPagerSlot,
                                    { height: TODAY_PAGER_HEIGHT },
                                ]}
                            >
                                <TodayHolidayCarousel
                                    items={todayItems}
                                    height={TODAY_PAGER_HEIGHT}
                                    renderItem={({ item }) => (
                                        <TodayHolidayHeroSlide
                                            holiday={item}
                                            onAbout={openAbout}
                                        />
                                    )}
                                />
                            </View>
                        </View>
                    ) : oneToday ? (
                        <View style={[ui.holidaysTodaySection, { flex: 1 }]}>
                            <TodayHolidayHeroSlide
                                holiday={singleHoliday}
                                onAbout={openAbout}
                            />
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
