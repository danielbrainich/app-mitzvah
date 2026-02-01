import React, { useCallback, useState, useMemo } from "react";
import { View, ScrollView, Linking, Text } from "react-native";
import { useFonts } from "expo-font";
import { useSelector } from "react-redux";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";

import useAppLocation from "../hooks/useAppLocation";
import useTodayIsoDay from "../hooks/useTodayIsoDay";
import { useShabbatData } from "../hooks/useShabbatData";
import { useShabbatCountdown } from "../hooks/useShabbatCountdown.js";
import { ui } from "../constants/theme";

import ShabbatTimesBottomSheet from "../components/shabbat/ShabbatTimesBottomSheet";
import ShabbatHero from "../components/shabbat/ShabbatHero";
import LocationChip from "../components/shabbat/LocationChip";
import LocationBottomSheet from "../components/shabbat/LocationBottomSheet";
import ParshaBottomSheet from "../components/shabbat/ParshaBottomSheet";
import ParshaCard from "../components/shabbat/ParshaCard";
import { buildShabbatViewModel } from "../lib/computeShabbatInfo";
import { getParshaDataByName } from "../data/parshiot";

export default function Shabbat() {
    const [fontsLoaded] = useFonts({
        ChutzBold: require("../../assets/fonts/Chutz-Bold.otf"),
    });

    const [showLocationDetails, setShowLocationDetails] = useState(false);
    const [activeParshiot, setActiveParshiot] = useState(null);

    const { candleLightingTime, havdalahTime } = useSelector(
        (state) => state.settings
    );

    const todayIso = useTodayIsoDay();
    const {
        status: locationStatus,
        location,
        requestPermission,
    } = useAppLocation();

    const hasLocation = locationStatus === "granted" && !!location;

    const candleMins = Number.isFinite(candleLightingTime)
        ? candleLightingTime
        : 18;
    const havdalahMins = Number.isFinite(havdalahTime) ? havdalahTime : 42;

    const { now, isDevOverride } = useShabbatCountdown(todayIso);

    const { shabbatInfo, loading, timezone } = useShabbatData({
        location: hasLocation ? location : null,
        candleMins,
        havdalahMins,
        now,
    });

    const vm = useMemo(() => {
        return buildShabbatViewModel(shabbatInfo, now, { isDevOverride });
    }, [shabbatInfo, now, isDevOverride]);

    const handleParshaPress = useCallback(() => {
        if (!shabbatInfo?.parshaEnglish) return;

        const data = getParshaDataByName(shabbatInfo.parshaEnglish);

        if (data) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setActiveParshiot(data);
        }
    }, [shabbatInfo?.parshaEnglish]);

    const handleEnableLocation = useCallback(async () => {
        const status = await requestPermission();

        if (status === "granted") {
            setShowLocationDetails(false);
        } else {
            Linking.openSettings();
        }
    }, [requestPermission]);

    const tabBarHeight = useBottomTabBarHeight();

    const [showShabbatTimes, setShowShabbatTimes] = useState(false);

    if (!fontsLoaded) return null;

    return (
        <View style={ui.safeArea}>
            <ScrollView
                style={ui.screen}
                contentContainerStyle={[
                    ui.scrollContent,
                    { flexGrow: 1, paddingBottom: tabBarHeight },
                ]}
                showsVerticalScrollIndicator={false}
                bounces
                alwaysBounceVertical
            >
                {/* Hero Section */}
                <View style={{ flex: 1 }}>
                    <View
                        style={{
                            flex: 1,
                            justifyContent: "center",
                        }}
                    >
                        <ShabbatHero
                            isDuring={vm.status.isDuring}
                            hasLocation={hasLocation}
                            shabbatInfo={shabbatInfo}
                            candleMins={candleMins}
                            havdalahMins={havdalahMins}
                            now={now}
                            onShowDetails={() => setShowShabbatTimes(true)}
                        />
                    </View>
                </View>

                {/* Parsha Card Section */}
                <View style={ui.holidaysComingUpSection}>
                    <Text style={[ui.h5, ui.textWhite]}>
                        Torah Portion this week
                    </Text>
                    <ParshaCard
                        parshaEnglish={shabbatInfo?.parshaEnglish}
                        parshaHebrew={shabbatInfo?.parshaHebrew}
                        parshaReplacedByHoliday={
                            shabbatInfo?.parshaReplacedByHoliday
                        }
                        onPress={handleParshaPress}
                    />
                    <View style={ui.mt3}>
                        <LocationChip
                            hasLocation={hasLocation}
                            onPress={() => setShowLocationDetails(true)}
                        />
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Sheets */}
            <LocationBottomSheet
                visible={showLocationDetails}
                onClose={() => setShowLocationDetails(false)}
                title="Location"
                snapPoints={["25%", "55%"]}
                hasLocation={hasLocation}
                location={location}
                timezone={timezone}
                onEnableLocation={handleEnableLocation}
            />

            <ParshaBottomSheet
                visible={!!activeParshiot}
                onClose={() => setActiveParshiot(null)}
                parshiot={activeParshiot}
                snapPoints={["35%", "75%"]}
            />

            <ShabbatTimesBottomSheet
                visible={showShabbatTimes}
                onClose={() => setShowShabbatTimes(false)}
                shabbatInfo={shabbatInfo}
                candleMins={candleMins}
                havdalahMins={havdalahMins}
            />
        </View>
    );
}
