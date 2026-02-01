import React from "react";
import { View, Text, Pressable, Linking, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { Entypo } from "@expo/vector-icons";
import { ui } from "../../constants/theme";

export default function ShabbatHero({
    isDuring,
    hasLocation,
    shabbatInfo,
    candleMins,
    havdalahMins,
    now,
    onShowDetails,
}) {
    const handleEnableLocation = () => {
        if (Platform.OS === "ios" || Platform.OS === "android") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
                () => {}
            );
        }
        Linking.openSettings();
    };

    const handleShowDetails = () => {
        if (Platform.OS === "ios" || Platform.OS === "android") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
                () => {}
            );
        }
        onShowDetails?.();
    };

    // Format time nicely (e.g., "7:23 PM")
    const formatTime = (date) => {
        if (!(date instanceof Date)) return "";
        return new Intl.DateTimeFormat("en-US", {
            hour: "numeric",
            minute: "2-digit",
        }).format(date);
    };

    // Format date without day of week (e.g., "February 6th")
    const formatDateShort = (dateString) => {
        if (!dateString) return "";
        const parts = dateString.split(", ");
        if (parts.length < 2) return dateString;

        const monthDay = parts[1];
        const [month, day] = monthDay.split(" ");
        const dayNum = parseInt(day);

        const suffix =
            dayNum % 10 === 1 && dayNum !== 11
                ? "st"
                : dayNum % 10 === 2 && dayNum !== 12
                ? "nd"
                : dayNum % 10 === 3 && dayNum !== 13
                ? "rd"
                : "th";

        return `${month} ${dayNum}${suffix}`;
    };

    const isFridayNow = now.getDay() === 5;
    const isSaturdayNow = now.getDay() === 6;

    return (
        <View style={ui.shabbatHeroWrap}>
            {isDuring ? (
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
                    {hasLocation && shabbatInfo?.shabbatEnds ? (
                        <View style={{ marginTop: 12 }}>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 6,
                                }}
                            >
                                <Text
                                    style={[ui.h5, ui.textWhite, ui.textCenter]}
                                >
                                    Shabbat ends{" "}
                                    {isSaturdayNow ? "today" : "Saturday"} at{" "}
                                    {formatTime(shabbatInfo.shabbatEnds)}
                                </Text>
                                <Pressable
                                    onPress={handleShowDetails}
                                    hitSlop={12}
                                    style={{ paddingBottom: 6 }}
                                >
                                    <Entypo
                                        name="dots-three-vertical"
                                        size={16}
                                        color="white"
                                    />
                                </Pressable>
                            </View>
                        </View>
                    ) : (
                        <View style={{ marginTop: 24 }}>
                            <Text style={[ui.paragraph, ui.textCenter]}>
                                Share your location for{"\n"}detailed Shabbat times
                            </Text>
                            <Pressable
                                onPress={handleEnableLocation}
                                style={[ui.button, ui.buttonOutline]}
                            >
                                <Text style={ui.buttonText}>
                                    Enable location
                                </Text>
                            </Pressable>
                        </View>
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
                                    ui.h3,
                                    ui.textBrand,
                                    ui.textChutz,
                                    ui.textCenter,
                                    ui.mt2,
                                    ui.mb2,
                                ]}
                            >
                                this evening
                            </Text>
                        </>
                    ) : (
                        <>
                            <Text style={[ui.h2, ui.textWhite, ui.textCenter]}>
                                Shabbat begins
                            </Text>
                            <Text
                                style={[
                                    ui.h3,
                                    ui.textBrand,
                                    ui.textChutz,
                                    ui.textCenter,
                                    ui.mt2,
                                ]}
                            >
                                {formatDateShort(shabbatInfo?.erevShabbatShort)}
                            </Text>
                        </>
                    )}

                    {hasLocation && shabbatInfo?.candleTime ? (
                        <View style={{ marginTop: 8 }}>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 6,
                                }}
                            >
                                <Text
                                    style={[ui.h5, ui.textWhite, ui.textCenter]}
                                >
                                    Candle lighting at{" "}
                                    {formatTime(shabbatInfo.candleTime)}
                                </Text>
                                <Pressable
                                    onPress={handleShowDetails}
                                    hitSlop={12}
                                    style={{ paddingBottom: 6 }}

                                >
                                    <Entypo
                                        name="dots-three-vertical"
                                        size={16}
                                        color="white"
                                    />
                                </Pressable>
                            </View>
                        </View>
                    ) : (
                        <View style={{ marginTop: 16 }}>
                            <Text style={[ui.paragraph, ui.textCenter]}>
                                Share your location for{"\n"}detailed Shabbat times
                            </Text>
                            <Pressable
                                onPress={handleEnableLocation}
                                style={[ui.button, ui.buttonOutline]}
                            >
                                <Text style={ui.buttonText}>
                                    Enable location
                                </Text>
                            </Pressable>
                        </View>
                    )}
                </>
            )}
        </View>
    );
}
