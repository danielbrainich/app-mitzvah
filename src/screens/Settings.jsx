import React, { useState, useCallback } from "react";
import {
    Text,
    View,
    ScrollView,
    Pressable,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useFonts } from "expo-font";
import { SafeAreaView } from "react-native-safe-area-context";
import { Entypo } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ui } from "../constants/theme";
import {
    toggleMinorFasts,
    toggleRosheiChodesh,
    toggleModernHolidays,
} from "../store/actions";
import { useTipsIap } from "../services/iap/useTipsIap";
import { useShabbatSettings } from "../hooks/useShabbatSettings";

import SettingsCard from "../components/settings/SettingsCard";
import SettingSwitch from "../components/settings/SettingSwitch";
import SettingSlider from "../components/settings/SettingSlider";
import TipSelector from "../components/settings/TipSelector";

export default function Settings({ navigation }) {
    const [fontsLoaded] = useFonts({
        ChutzBold: require("../../assets/fonts/Chutz-Bold.otf"),
    });

    const settings = useSelector((state) => state.settings);
    const { minorFasts, rosheiChodesh, modernHolidays } = settings;

    const dispatch = useDispatch();
    const [tipAmount, setTipAmount] = useState(5);

    const { loading: iapLoading, tip } = useTipsIap();

    const {
        candleValue,
        havdalahValue,
        candleDisplayValue,
        havdalahDisplayValue,
        handleCandleLightingToggle,
        handleHavdalahTimeToggle,
        handleCandleValueChange,
        handleHavdalahValueChange,
    } = useShabbatSettings(settings);

    const onTipPress = useCallback(() => tip(tipAmount), [tip, tipAmount]);

    if (!fontsLoaded) return null;

    return (
        <View style={ui.safeArea}>
            <SafeAreaView style={ui.safeArea} edges={["top", "left", "right"]}>
                {/* Back Button */}
                <View style={ui.settingsTopBar}>
                    <Pressable
                        onPress={() => {
                            navigation.goBack();
                            Haptics.impactAsync(
                                Haptics.ImpactFeedbackStyle.Light
                            );
                        }}
                        hitSlop={12}
                        style={ui.iconButtonSmall}
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
                    {/* Holiday Options */}
                    <SettingsCard title="Holiday Options">
                        <SettingSwitch
                            label="Include modern holidays"
                            value={modernHolidays}
                            onValueChange={() =>
                                dispatch(toggleModernHolidays())
                            }
                        />
                        <SettingSwitch
                            label="Include minor fasts"
                            value={minorFasts}
                            onValueChange={() => dispatch(toggleMinorFasts())}
                        />
                        <SettingSwitch
                            label="Include roshei chodesh"
                            value={rosheiChodesh}
                            onValueChange={() =>
                                dispatch(toggleRosheiChodesh())
                            }
                        />
                    </SettingsCard>

                    {/* Shabbat Options */}
                    <SettingsCard title="Shabbat Options">
                        <SettingSwitch
                            label="Custom candle lighting"
                            sublabel={`Minutes before sundown: ${candleDisplayValue}`}
                            value={settings.candleLightingToggle}
                            onValueChange={handleCandleLightingToggle}
                        />

                        {settings.candleLightingToggle && (
                            <SettingSlider
                                value={candleValue}
                                onValueChange={handleCandleValueChange}
                                showDivider
                            />
                        )}

                        <SettingSwitch
                            label="Custom shabbat end"
                            sublabel={`Minutes after sundown: ${havdalahDisplayValue}`}
                            value={settings.havdalahTimeToggle}
                            onValueChange={handleHavdalahTimeToggle}
                        />

                        {settings.havdalahTimeToggle && (
                            <SettingSlider
                                value={havdalahValue}
                                onValueChange={handleHavdalahValueChange}
                            />
                        )}
                    </SettingsCard>

                    {/* Support */}
                    <SettingsCard title="Support">
                        <Text style={ui.paragraph}>
                            If you enjoy using this app, please consider leaving
                            a tip!
                        </Text>

                        <TipSelector
                            selectedAmount={tipAmount}
                            onAmountChange={setTipAmount}
                        />

                        <TouchableOpacity
                            style={[ui.button, ui.buttonOutline]}
                            onPress={onTipPress}
                            activeOpacity={0.85}
                            disabled={iapLoading}
                        >
                            {iapLoading ? (
                                <ActivityIndicator />
                            ) : (
                                <Text style={ui.buttonText}>
                                    Tip ${tipAmount}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </SettingsCard>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
