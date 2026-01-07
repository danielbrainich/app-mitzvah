import { useFonts } from "expo-font";
import { Text, View, Switch, ScrollView } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import React, { useMemo, useCallback } from "react";
import Slider from "@react-native-community/slider";
import { SafeAreaView } from "react-native-safe-area-context";

import { ui } from "../../styles/theme";

import {
    toggleMinorFasts,
    toggleRosheiChodesh,
    toggleModernHolidays,
    setCandleLightingTime,
    setHavdalahTime,
    setCandleLightingToggle,
    setHavdalahTimeToggle,
} from "../../store/actions";

const DEFAULT_CANDLE = 18;
const DEFAULT_HAVDALAH = 42;
const MIN_MINS = 1;
const MAX_MINS = 60;

export default function Settings() {
    const [fontsLoaded] = useFonts({
        // Settings.js is in components/screens, so assets is 3 levels up
        Nayuki: require("../../assets/fonts/NayukiRegular.otf"),
    });

    const {
        minorFasts,
        rosheiChodesh,
        modernHolidays,
        candleLightingTime,
        havdalahTime,
        candleLightingToggle,
        havdalahTimeToggle,
    } = useSelector((state) => state.settings);

    const dispatch = useDispatch();

    // Slider expects a number. When toggle is off you store null in Redux,
    // but we still want a sane slider position when toggled back on.
    const candleValue = useMemo(() => {
        if (!candleLightingToggle) return DEFAULT_CANDLE;
        return Number.isFinite(candleLightingTime)
            ? candleLightingTime
            : DEFAULT_CANDLE;
    }, [candleLightingToggle, candleLightingTime]);

    const havdalahValue = useMemo(() => {
        if (!havdalahTimeToggle) return DEFAULT_HAVDALAH;
        return Number.isFinite(havdalahTime) ? havdalahTime : DEFAULT_HAVDALAH;
    }, [havdalahTimeToggle, havdalahTime]);

    const handleCandleLightingToggle = useCallback(() => {
        const newToggleState = !candleLightingToggle;
        dispatch(setCandleLightingToggle(newToggleState));

        if (newToggleState) {
            const v = Number.isFinite(candleLightingTime)
                ? candleLightingTime
                : DEFAULT_CANDLE;
            dispatch(setCandleLightingTime(v));
        } else {
            dispatch(setCandleLightingTime(null));
        }
    }, [dispatch, candleLightingToggle, candleLightingTime]);

    const handleHavdalahTimeToggle = useCallback(() => {
        const newToggleState = !havdalahTimeToggle;
        dispatch(setHavdalahTimeToggle(newToggleState));

        if (newToggleState) {
            const v = Number.isFinite(havdalahTime)
                ? havdalahTime
                : DEFAULT_HAVDALAH;
            dispatch(setHavdalahTime(v));
        } else {
            dispatch(setHavdalahTime(null));
        }
    }, [dispatch, havdalahTimeToggle, havdalahTime]);

    if (!fontsLoaded) return null;

    return (
        <SafeAreaView style={ui.container}>
            <ScrollView
                style={ui.screen}
                contentContainerStyle={ui.scrollContent}
            >
                {/* Holiday Options Card */}
                <View style={ui.card}>
                    <Text style={ui.cardTitle}>Holiday Options</Text>

                    <View style={ui.row}>
                        <Text style={ui.settingsRowLabel}>
                            Include modern holidays
                        </Text>
                        <Switch
                            trackColor={{ false: "#767577", true: "#82CBFF" }}
                            thumbColor={"#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={() =>
                                dispatch(toggleModernHolidays())
                            }
                            value={modernHolidays}
                        />
                    </View>

                    <View style={ui.row}>
                        <Text style={ui.settingsRowLabel}>
                            Include minor fasts
                        </Text>
                        <Switch
                            trackColor={{ false: "#767577", true: "#82CBFF" }}
                            thumbColor={"#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={() => dispatch(toggleMinorFasts())}
                            value={minorFasts}
                        />
                    </View>

                    <View style={ui.row}>
                        <Text style={ui.settingsRowLabel}>
                            Include roshei chodesh
                        </Text>
                        <Switch
                            trackColor={{ false: "#767577", true: "#82CBFF" }}
                            thumbColor={"#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={() =>
                                dispatch(toggleRosheiChodesh())
                            }
                            value={rosheiChodesh}
                        />
                    </View>
                </View>

                {/* Shabbat Options Card */}
                <View style={ui.card}>
                    <Text style={ui.cardTitle}>Shabbat Options</Text>

                    {/* Candle Lighting */}
                    <View style={ui.row}>
                        <View style={ui.rowLeft}>
                            <Text style={ui.settingsRowLabel}>
                                Custom candle lighting
                            </Text>
                            <Text style={ui.settingsSubLabel}>
                                Default is {DEFAULT_CANDLE} min before sundown
                            </Text>
                        </View>

                        <Switch
                            trackColor={{ false: "#767577", true: "#82CBFF" }}
                            thumbColor={"#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={handleCandleLightingToggle}
                            value={candleLightingToggle}
                        />
                    </View>

                    {candleLightingToggle ? (
                        <View style={ui.settingsSliderBlock}>
                            <View style={ui.settingsSliderHeader}>
                                <Text style={ui.settingsSliderValue}>
                                    {candleValue} min
                                </Text>
                                <Text style={ui.settingsSliderHint}>
                                    before sundown
                                </Text>
                            </View>

                            <Slider
                                value={candleValue}
                                minimumValue={MIN_MINS}
                                maximumValue={MAX_MINS}
                                step={1}
                                minimumTrackTintColor="#82CBFF"
                                maximumTrackTintColor="rgba(255,255,255,0.25)"
                                thumbTintColor="#f4f3f4"
                                onValueChange={(v) =>
                                    dispatch(
                                        setCandleLightingTime(Math.round(v))
                                    )
                                }
                            />
                        </View>
                    ) : null}

                    {/* Havdalah */}
                    <View style={ui.row}>
                        <View style={ui.rowLeft}>
                            <Text style={ui.settingsRowLabel}>
                                Custom Havdalah
                            </Text>
                            <Text style={ui.settingsSubLabel}>
                                Default is {DEFAULT_HAVDALAH} min after sundown
                            </Text>
                        </View>

                        <Switch
                            trackColor={{ false: "#767577", true: "#82CBFF" }}
                            thumbColor={"#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={handleHavdalahTimeToggle}
                            value={havdalahTimeToggle}
                        />
                    </View>

                    {havdalahTimeToggle ? (
                        <View style={ui.settingsSliderBlock}>
                            <View style={ui.settingsSliderHeader}>
                                <Text style={ui.settingsSliderValue}>
                                    {havdalahValue} min
                                </Text>
                                <Text style={ui.settingsSliderHint}>
                                    after sundown
                                </Text>
                            </View>

                            <Slider
                                value={havdalahValue}
                                minimumValue={MIN_MINS}
                                maximumValue={MAX_MINS}
                                step={1}
                                minimumTrackTintColor="#82CBFF"
                                maximumTrackTintColor="rgba(255,255,255,0.25)"
                                thumbTintColor="#f4f3f4"
                                onValueChange={(v) =>
                                    dispatch(setHavdalahTime(Math.round(v)))
                                }
                            />
                        </View>
                    ) : null}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
