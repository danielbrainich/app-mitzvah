import React, { useCallback, useState } from "react";
import { Text, View, ScrollView } from "react-native";
import { useFonts } from "expo-font";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import { ui } from "../constants/theme";
import { getHolidayDetailsByName } from "../utils/getHolidayDetails";
import { useHolidayData } from "../hooks/useHolidayData";

import TodaySection from "../components/holidays/TodaySection";
import UpcomingHolidaysCarousel from "../components/holidays/UpcomingHolidaysCarousel";
import HolidayBottomSheet from "../components/holidays/HolidayBottomSheet";

const UPCOMING_HEIGHT = 120;

export default function Holidays() {
    const [fontsLoaded] = useFonts({
        ChutzBold: require("../../assets/fonts/Chutz-Bold.otf"),
    });

    const { todayHolidays, upcoming } = useHolidayData();

    const [aboutOpen, setAboutOpen] = useState(false);
    const [aboutHoliday, setAboutHoliday] = useState(null);

    const openAbout = useCallback((holiday) => {
        if (!holiday) return;
        setAboutHoliday(holiday);
        requestAnimationFrame(() => setAboutOpen(true));
    }, []);

    const closeAbout = useCallback(() => setAboutOpen(false), []);

    const tabBarHeight = useBottomTabBarHeight();

    if (!fontsLoaded) return null;

    return (
        <View style={ui.safeArea}>
            <ScrollView
                style={ui.screen}
                contentContainerStyle={[
                    ui.scrollContent,
                    { flexGrow: 1, paddingBottom: tabBarHeight + 16 },
                ]}
            >
                <View style={{ flex: 1 }}>
                    <TodaySection
                        todayHolidays={todayHolidays}
                        onAbout={openAbout}
                    />
                </View>

                {/* Coming Up Section */}
                <View style={ui.holidaysComingUpSection}>
                    <Text style={ui.holidaysSecondHeaderText}>Coming up</Text>

                    <View style={{ height: UPCOMING_HEIGHT }}>
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
                isoDate={aboutHoliday?.date ?? ""}
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
