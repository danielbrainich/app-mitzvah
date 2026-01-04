import { useFonts } from "expo-font";
import {
    StyleSheet,
    Text,
    SafeAreaView,
    View,
    Switch,
    ScrollView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import Slider from "@react-native-community/slider";

import {
    toggleHebrewDate,
    toggleMinorFasts,
    toggleRosheiChodesh,
    toggleModernHolidays,
    setCandleLightingTime,
    setHavdalahTime,
    setCandleLightingToggle,
    setHavdalahTimeToggle,
} from "../../store/actions";
import InfoFooter from "../InfoFooter";

const DEFAULT_CANDLE = 18;
const DEFAULT_HAVDALAH = 42;
const MIN_MINS = 1;
const MAX_MINS = 60;

export default function Settings() {
    const [fontsLoaded] = useFonts({
        Nayuki: require("../../assets/fonts/NayukiRegular.otf"),
    });

    const {
        hebrewDate,
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
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.screen}>
                {/* Holiday Options Card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Holiday Options</Text>

                    <View style={styles.row}>
                        <Text style={styles.rowLabel}>
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

                    <View style={styles.row}>
                        <Text style={styles.rowLabel}>Include minor fasts</Text>
                        <Switch
                            trackColor={{ false: "#767577", true: "#82CBFF" }}
                            thumbColor={"#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={() => dispatch(toggleMinorFasts())}
                            value={minorFasts}
                        />
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.rowLabel}>
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

                    <View style={styles.row}>
                        <Text style={styles.rowLabel}>Display Hebrew date</Text>
                        <Switch
                            trackColor={{ false: "#767577", true: "#82CBFF" }}
                            thumbColor={"#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={(v) => dispatch(toggleHebrewDate(v))}
                            value={hebrewDate}
                        />
                    </View>
                </View>

                {/* Shabbat Options Card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Shabbat Options</Text>

                    {/* Candle Lighting */}
                    <View style={styles.row}>
                        <View style={styles.rowLeft}>
                            <Text style={styles.rowLabel}>
                                Custom candle lighting
                            </Text>
                            <Text style={styles.subLabel}>
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
                        <View style={styles.sliderBlock}>
                            <View style={styles.sliderHeader}>
                                <Text style={styles.sliderValue}>
                                    {candleValue} min
                                </Text>
                                <Text style={styles.sliderHint}>
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
                    <View style={styles.row}>
                        <View style={styles.rowLeft}>
                            <Text style={styles.rowLabel}>Custom Havdalah</Text>
                            <Text style={styles.subLabel}>
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
                        <View style={styles.sliderBlock}>
                            <View style={styles.sliderHeader}>
                                <Text style={styles.sliderValue}>
                                    {havdalahValue} min
                                </Text>
                                <Text style={styles.sliderHint}>
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

                <InfoFooter />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
    },
    screen: {
        paddingHorizontal: 20,
        paddingTop: 66,
        paddingBottom: 24,
    },

    // Match your Shabbat cards
    card: {
        backgroundColor: "#202020",
        borderRadius: 18,
        padding: 18,
        marginBottom: 18,
    },
    cardTitle: {
        color: "#82CBFF",
        fontFamily: "Nayuki",
        fontSize: 30,
        marginBottom: 10,
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 10,
    },
    rowLeft: {
        flex: 1,
        paddingRight: 12,
    },
    rowLabel: {
        color: "white",
        fontSize: 18,
        lineHeight: 22,
    },
    subLabel: {
        color: "rgba(255,255,255,0.72)",
        fontSize: 13,
        marginTop: 6,
        lineHeight: 17,
    },

    sliderBlock: {
        paddingTop: 6,
        paddingBottom: 10,
    },
    sliderHeader: {
        flexDirection: "row",
        alignItems: "baseline",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    sliderValue: {
        color: "#82CBFF",
        fontSize: 16,
        fontWeight: "500",
    },
    sliderHint: {
        color: "#82CBFF",
        fontSize: 16,
        fontWeight: "500",
    },
});
