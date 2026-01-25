import React, { useCallback, useState, useMemo } from "react";
import { View, ScrollView, Linking } from "react-native";
import { useFonts } from "expo-font";
import { useSelector } from "react-redux";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";

import useAppLocation from "../hooks/useAppLocation";
import useTodayIsoDay from "../hooks/useTodayIsoDay";
import { useShabbatData } from "../hooks/useShabbatData";
import { useShabbatCountdown } from "../hooks/useShabbatCountdown";
import { ui } from "../constants/theme";

import ShabbatHero from "../components/shabbat/ShabbatHero";
import ShabbatCountdown from "../components/shabbat/ShabbatCountdown";
import ShabbatTimesCard from "../components/shabbat/ShabbatTimesCard";
import LocationChip from "../components/shabbat/LocationChip";
import LoadingCard from "../components/shabbat/LoadingCard";
import LocationBottomSheet from "../components/shabbat/LocationBottomSheet";
import ParshaBottomSheet from "../components/shabbat/ParshaBottomSheet";

import { buildShabbatViewModel } from "../lib/computeShabbatInfo";
import { getParshaDataByName } from "../data/parshiot";

export default function Shabbat() {
    const [fontsLoaded] = useFonts({
        ChutzBold: require("../../assets/fonts/Chutz-Bold.otf"),
    });

    const [showLocationDetails, setShowLocationDetails] = useState(false);
    const [activeParsha, setActiveParsha] = useState(null);

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

    // Custom hooks handle all the complex logic
    const { shabbatInfo, loading, timezone } = useShabbatData({
        location: hasLocation ? location : null,
        candleMins,
        havdalahMins,
        now,
    });

    // Build view model for UI
    const vm = useMemo(() => {
        return buildShabbatViewModel(shabbatInfo, now, { isDevOverride });
    }, [shabbatInfo, now, isDevOverride]);

    const handleParshaPress = useCallback(() => {
        if (!shabbatInfo?.parshaEnglish) return;

        const data = getParshaDataByName(shabbatInfo.parshaEnglish);
        if (data) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setActiveParsha(data);
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
    const MAX_WIDTH = 520;

    if (!fontsLoaded) return null;

    return (
        <View style={ui.safeArea}>
            <ScrollView
                style={ui.screen}
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingBottom: tabBarHeight + 10,
                }}
                showsVerticalScrollIndicator={false}
                bounces
                alwaysBounceVertical
            >
                <View style={{ flex: 1, width: "100%", alignItems: "center" }}>
                    <View
                        style={{ flex: 1, width: "100%", maxWidth: MAX_WIDTH }}
                    >
                        {/* Hero and Countdown Section */}
                        <View
                            style={{
                                flex: 1,
                                justifyContent: "center",
                                paddingTop: 8,
                            }}
                        >
                            <ShabbatHero
                                isDuring={vm.status.isDuring}
                                hasLocation={hasLocation}
                                showCountdown={vm.countdown?.show}
                            /> 
                            {vm.countdown?.show && !vm.status.isDuring && (
                                <ShabbatCountdown parts={vm.countdown.parts} />
                            )}
                        </View>

                        {/* Times Card and Location */}
                        {/* Times Card and Location */}
                        <View style={{ width: "100%" }}>
                            <ShabbatTimesCard
                                shabbatInfo={shabbatInfo}
                                onParshaPress={handleParshaPress}
                                loading={loading}
                            />

                            <LocationChip
                                hasLocation={hasLocation}
                                onPress={() => setShowLocationDetails(true)}
                            />
                        </View>
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
                visible={!!activeParsha}
                onClose={() => setActiveParsha(null)}
                english={activeParsha?.english}
                hebrew={activeParsha?.hebrew}
                verses={activeParsha?.verses}
                blurb={activeParsha?.blurb}
                snapPoints={["35%", "65%"]}
            />
        </View>
    );
}
