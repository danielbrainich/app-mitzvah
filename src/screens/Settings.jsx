import React, { useState, useCallback } from "react";
import {
    Text,
    View,
    ScrollView,
    Pressable,
    Linking,
    ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useFonts } from "expo-font";
import { SafeAreaView } from "react-native-safe-area-context";
import { Entypo } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ui, colors } from "../constants/theme";
import {
    toggleMinorFasts,
    toggleRosheiChodesh,
    toggleModernHolidays,
    toggleSpecialShabbatot,
} from "../store/slices/settingsSlice";
import { useShabbatSettings } from "../hooks/useShabbatSettings";

import { useTipsIap } from "../services/iap/useTipsIap";
import TipSelector from "../components/settings/TipSelector";

import SettingsCard from "../components/settings/SettingsCard";
import SettingSwitch from "../components/settings/SettingSwitch";
import SettingSlider from "../components/settings/SettingSlider";
import PopupModal from "../components/common/PopupModal";

export default function Settings({ navigation }) {
    const [fontsLoaded] = useFonts({
        ChutzBold: require("../../assets/fonts/Chutz-Bold.otf"),
    });

    const settings = useSelector((state) => state.settings);
    const { minorFasts, rosheiChodesh, modernHolidays, specialShabbatot } =
        settings;

    const dispatch = useDispatch();

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

    const [tipAmount, setTipAmount] = useState(5);
    const { loading: iapLoading, tip } = useTipsIap();

    const [tipPopup, setTipPopup] = useState(null);

    const handleTipAttempt = useCallback(
        async (amount) => {
            try {
                await tip(amount);

                setTipPopup({
                    title: "Thank you!",
                    message: "Your tip means a lot. 💙",
                    primaryLabel: "Done",
                    onPrimary: () => setTipPopup(null),
                });
            } catch (e) {
                if (e?.code === "TIP_CANCELLED") {
                    // User hit cancel — do nothing
                    return;
                }

                setTipPopup({
                    title: "Tips not working",
                    message:
                        "In-app purchases aren’t working right now. Please try again later.",
                    primaryLabel: "OK",
                    onPrimary: () => setTipPopup(null),
                });
            }
        },
        [tip]
    );

    const onTipPress = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        handleTipAttempt(tipAmount);
    }, [handleTipAttempt, tipAmount]);

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
                            ).catch(() => {});
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
                    <SettingsCard title="Holiday Options" variant="flat">
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
                        <SettingSwitch
                            label="Include special shabbatot"
                            value={specialShabbatot}
                            onValueChange={() =>
                                dispatch(toggleSpecialShabbatot())
                            }
                        />
                    </SettingsCard>

                    <View
                        style={[
                            ui.divider,
                            {
                                height: 1,
                                backgroundColor: "rgba(255,255,255,0.25)",
                                marginTop: 8,
                                marginBottom: 12,
                            },
                        ]}
                    />

                    {/* Shabbat Options */}
                    <SettingsCard title="Shabbat Options" variant="flat">
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

                    {/* Support Section */}
                    <View style={{ marginTop: 16 }}>
                        <SettingsCard title="" variant="card">
                            <View style={{ paddingBottom: 10 }}>
                                <Text style={ui.paragraph}>
                                    If you enjoy using this app, please consider
                                    leaving a tip!
                                </Text>

                                <TipSelector
                                    selectedAmount={tipAmount}
                                    onAmountChange={setTipAmount}
                                />

                                <Pressable
                                    style={[
                                        ui.button,
                                        ui.buttonOutline,
                                        { borderColor: colors.accent },
                                    ]}
                                    onPress={onTipPress}
                                    disabled={iapLoading}
                                >
                                    {iapLoading ? (
                                        <ActivityIndicator
                                            color={colors.accent}
                                        />
                                    ) : (
                                        <Text
                                            style={[
                                                ui.buttonText,
                                                ui.textBrand,
                                            ]}
                                        >
                                            Tip ${tipAmount}
                                        </Text>
                                    )}
                                </Pressable>
                            </View>
                        </SettingsCard>
                    </View>

                    {/* Footer */}
                    <View style={{ flex: 1 }} />

                    <View style={{ paddingVertical: 24, alignItems: "center" }}>
                        <Text
                            style={[
                                ui.label,
                                { textAlign: "center", marginBottom: 4 },
                            ]}
                        >
                            Version 2.0.0
                        </Text>

                        <Pressable
                            onPress={() => {
                                Linking.openURL("https://danielbrainich.com");
                                Haptics.impactAsync(
                                    Haptics.ImpactFeedbackStyle.Light
                                ).catch(() => {});
                            }}
                            hitSlop={12}
                        >
                            <Text
                                style={[
                                    ui.label,
                                    { textAlign: "center", opacity: 0.6 },
                                ]}
                            >
                                🩶 dbrainy
                            </Text>
                        </Pressable>
                    </View>
                </ScrollView>

                {/* Overlay modal OUTSIDE ScrollView */}
                <PopupModal
                    visible={!!tipPopup}
                    title={tipPopup?.title}
                    message={tipPopup?.message}
                    primaryLabel={tipPopup?.primaryLabel}
                    secondaryLabel={tipPopup?.secondaryLabel}
                    onPrimary={tipPopup?.onPrimary}
                    onSecondary={tipPopup?.onSecondary}
                    onClose={() => setTipPopup(null)}
                />
            </SafeAreaView>
        </View>
    );
}
