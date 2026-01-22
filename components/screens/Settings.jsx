import { useFonts } from "expo-font";
import {
    Text,
    View,
    Switch,
    ScrollView,
    Pressable,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import React, { useMemo, useCallback, useState, useEffect } from "react";
import Slider from "@react-native-community/slider";
import { SafeAreaView } from "react-native-safe-area-context";
import { Entypo } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

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
import { LayoutAnimation } from "react-native";
import { useTipsIap } from "../../iap/useTipsIap";

const DEFAULT_CANDLE = 0;
const DEFAULT_HAVDALAH = 0;
const MIN_MINS = 0;
const MAX_MINS = 60;

export default function Settings({ navigation }) {
    const [fontsLoaded] = useFonts({
        ChutzBold: require("../../assets/fonts/Chutz-Bold.otf"),
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
    const [amount, setAmount] = useState(5);

    const {
        tipProducts,
        ready: iapReady,
        loading: iapLoading,
        tip,
    } = useTipsIap();

    const onTipPress = useCallback(() => tip(amount), [tip, amount]);

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
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

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
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

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
        <View style={ui.safeArea}>
            <SafeAreaView style={ui.safeArea} edges={["top", "left", "right"]}>
                {/* Top-left back button */}
                <View style={ui.settingsTopBar}>
                    <Pressable
                        onPress={() => {
                            navigation.goBack();
                            Haptics.impactAsync(
                                Haptics.ImpactFeedbackStyle.Light
                            );
                        }}
                        hitSlop={12}
                        style={ui.iconBtnSm}
                    >
                        <Entypo name="chevron-left" size={22} color="white" />
                    </Pressable>
                </View>

                <ScrollView
                    style={ui.screen}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[
                        ui.scrollContent,
                        ui.settingsScrollContent,
                    ]}
                >
                    {/* Holiday Options Card */}
                    <View style={ui.card}>
                        <Text style={ui.settingsCardTitle}>
                            Holiday Options
                        </Text>

                        <View style={ui.settingsRow}>
                            <Text style={ui.settingsRowLabel}>
                                Include modern holidays
                            </Text>
                            <Switch
                                trackColor={{
                                    false: "#767577",
                                    true: "#82CBFF",
                                }}
                                thumbColor="#f4f3f4"
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={() =>
                                    dispatch(toggleModernHolidays())
                                }
                                value={modernHolidays}
                            />
                        </View>

                        <View style={ui.settingsRow}>
                            <Text style={ui.settingsRowLabel}>
                                Include minor fasts
                            </Text>
                            <Switch
                                trackColor={{
                                    false: "#767577",
                                    true: "#82CBFF",
                                }}
                                thumbColor="#f4f3f4"
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={() =>
                                    dispatch(toggleMinorFasts())
                                }
                                value={minorFasts}
                            />
                        </View>

                        <View style={ui.settingsRow}>
                            <Text style={ui.settingsRowLabel}>
                                Include roshei chodesh
                            </Text>
                            <Switch
                                trackColor={{
                                    false: "#767577",
                                    true: "#82CBFF",
                                }}
                                thumbColor="#f4f3f4"
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
                        <Text
                            style={ui.settingsCardTitle}
                        >
                            Shabbat Options
                        </Text>

                        {/* Candle Lighting */}
                        <View style={ui.settingsRow}>
                            <View style={ui.rowLeft}>
                                <Text style={ui.settingsRowLabel}>
                                    Custom candle lighting
                                </Text>
                                <Text style={ui.settingsSubLabel}>
                                    Minutes before sundown:{" "}
                                    {candleLightingToggle ? candleValue : 18}
                                </Text>
                            </View>

                            <Switch
                                trackColor={{
                                    false: "#767577",
                                    true: "#82CBFF",
                                }}
                                thumbColor="#f4f3f4"
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={handleCandleLightingToggle}
                                value={candleLightingToggle}
                            />
                        </View>

                        {candleLightingToggle ? (
                            <View style={ui.settingsSliderBlock}>
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

                                <View style={ui.sheetDivider} />
                            </View>
                        ) : null}

                        {/* Havdalah */}
                        <View style={ui.settingsRow}>
                            <View style={ui.rowLeft}>
                                <Text style={ui.settingsRowLabel}>
                                    Custom shabbat end
                                </Text>
                                <Text style={ui.settingsSubLabel}>
                                    Minutes after sundown:{" "}
                                    {havdalahTimeToggle ? havdalahValue : 42}
                                </Text>
                            </View>

                            <Switch
                                trackColor={{
                                    false: "#767577",
                                    true: "#82CBFF",
                                }}
                                thumbColor="#f4f3f4"
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={handleHavdalahTimeToggle}
                                value={havdalahTimeToggle}
                            />
                        </View>

                        {havdalahTimeToggle ? (
                            <View style={ui.settingsSliderBlock}>
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

                    {/* Support */}
                    <View style={ui.card}>
                        <Text style={ui.settingsCardTitle}>
                            Support
                        </Text>

                        <Text style={ui.paragraph}>
                            If you enjoy using this app, please consider leaving
                            a tip!
                        </Text>

                        {/* Tier selector */}
                        <View style={ui.infoTiersRow}>
                            {[1, 2, 5, 10, 18].map((v) => {
                                const selected = v === amount;
                                return (
                                    <TouchableOpacity
                                        key={v}
                                        onPress={() => {
                                            setAmount(v);
                                            Haptics.impactAsync(
                                                Haptics.ImpactFeedbackStyle
                                                    .Light
                                            );
                                        }}
                                        activeOpacity={0.85}
                                        style={[
                                            ui.infoTierPill,
                                            selected
                                                ? ui.infoTierPillSelected
                                                : null,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                ui.infoTierText,
                                                selected
                                                    ? ui.infoTierTextSelected
                                                    : null,
                                            ]}
                                        >
                                            ${v}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        {/* Tip button */}
                        <TouchableOpacity
                            style={ui.primaryButton}
                            onPress={onTipPress}
                            activeOpacity={0.85}
                            disabled={iapLoading}
                        >
                            {iapLoading ? (
                                <ActivityIndicator />
                            ) : (
                                <Text style={ui.primaryButtonText}>
                                    Tip ${amount}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
