import React from "react";
import { Text, View, ScrollView, Pressable, Linking } from "react-native";
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
    toggleSpecialShabbatot,
} from "../store/slices/settingsSlice";
import { useShabbatSettings } from "../hooks/useShabbatSettings";

import SettingsCard from "../components/settings/SettingsCard";
import SettingSwitch from "../components/settings/SettingSwitch";
import SettingSlider from "../components/settings/SettingSlider";

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
                        <SettingSwitch
                            label="Special Shabbatot"
                            value={specialShabbatot}
                            onValueChange={() =>
                                dispatch(toggleSpecialShabbatot())
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

                    {/* Footer - Fixed to bottom */}
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
                                );
                            }}
                            hitSlop={12}
                        >
                            <Text
                                style={[
                                    ui.label,
                                    { textAlign: "center", opacity: 0.6 },
                                ]}
                            >
                                💙 dbrainy
                            </Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
