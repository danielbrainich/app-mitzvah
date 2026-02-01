import React from "react";
import { View, Text, Pressable, Linking, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { ui } from "../../constants/theme";

export default function ShabbatHero({
    isDuring,
    hasLocation,
    shabbatInfo,
    candleMins,
    havdalahMins,
    now,
}) {
    const handleEnableLocation = () => {
        if (Platform.OS === "ios" || Platform.OS === "android") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
                () => {}
            );
        }
        Linking.openSettings();
    };

    // Format time nicely (e.g., "7:23 PM")
    const formatTime = (date) => {
        if (!(date instanceof Date)) return "";
        return new Intl.DateTimeFormat("en-US", {
            hour: "numeric",
            minute: "2-digit",
        }).format(date);
    };

    const isFridayNow = now.getDay() === 5;
    const isSaturdayNow = now.getDay() === 6;

    return (
        <View style={ui.shabbatHeroWrap}>
            {!hasLocation ? (
                <>
                    <Text style={[ui.paragraph, ui.textCenter]}>
                        Enable Location Services{"\n"}for detailed Shabbat times
                    </Text>
                    <Pressable
                        onPress={handleEnableLocation}
                        style={[ui.button, ui.buttonOutline]}
                    >
                        <Text style={ui.buttonText}>Enable location</Text>
                    </Pressable>
                </>
            ) : isDuring ? (
                <>
                    <Text
                        style={[
                            ui.h1,
                            ui.textBrand,
                            ui.textChutz,
                            ui.textCenter,
                        ]}
                    >
                        Shabbat Shalom
                    </Text>
                    {shabbatInfo?.shabbatEnds && (
                        <>
                            <Text
                                style={[
                                    ui.h5,
                                    ui.textWhite,
                                    ui.textCenter,
                                    ui.mt3,
                                ]}
                            >
                                Shabbat ends{" "}
                                {isSaturdayNow ? "today" : "Saturday"} at
                            </Text>
                            <Text
                                style={[
                                    ui.h3,
                                    ui.textWhite,
                                    ui.textCenter,
                                    ui.mt1,
                                ]}
                            >
                                {formatTime(shabbatInfo.shabbatEnds)}
                            </Text>
                            <Text style={[ui.label, ui.textCenter]}>
                                {havdalahMins} minutes after{" "}
                                {formatTime(shabbatInfo.saturdaySunset)} sundown
                            </Text>
                        </>
                    )}
                </>
            ) : (
                <>
                    {isFridayNow ? (
                        <>
                            <Text style={[ui.h2, ui.textWhite, ui.textCenter]}>
                                Shabbat begins
                            </Text>
                            <Text
                                style={[
                                    ui.h1,
                                    ui.textBrand,
                                    ui.textChutz,
                                    ui.textCenter,
                                ]}
                            >
                                Today
                            </Text>
                        </>
                    ) : (
                        <>
                            <Text style={[ui.h2, ui.textWhite, ui.textCenter]}>
                                Shabbat begins
                            </Text>
                            <Text
                                style={[
                                    ui.h1,
                                    ui.textBrand,
                                    ui.textChutz,
                                    ui.textCenter,
                                    ui.mt2,
                                ]}
                            >
                                {shabbatInfo?.erevShabbatShort}
                            </Text>
                        </>
                    )}
                    {shabbatInfo?.candleTime && (
                        <>
                            <Text
                                style={[
                                    ui.h3,
                                    ui.textWhite,
                                    ui.textCenter,
                                    ui.mt2,
                                ]}
                            >
                                {formatTime(shabbatInfo.candleTime)}
                            </Text>
                            <Text style={[ui.label, ui.textCenter]}>
                                {candleMins} minutes before{" "}
                                {formatTime(shabbatInfo.fridaySunset)} sundown
                            </Text>
                        </>
                    )}
                </>
            )}
        </View>
    );
}
