import React from "react";
import { View, Text, Pressable, Linking, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { ui } from "../../constants/theme";

export default function ShabbatHero({
    status,
    hasLocation,
    shabbatInfo,
    candleMins,
    havdalahMins,
    now,
    onShowDetails,
}) {
    const {
        isBefore = false,
        isDuring = false,
        isAfter = false,
    } = status ?? {};

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

    const formatTime = (date) => {
        if (!(date instanceof Date)) return "";
        return new Intl.DateTimeFormat("en-US", {
            hour: "numeric",
            minute: "2-digit",
        }).format(date);
    };

    const formatDateShort = (dateString) => {
        if (!dateString) return "";
        const parts = dateString.split(", ");
        if (parts.length < 2) return dateString;

        const monthDay = parts[1];
        const [month, day] = monthDay.split(" ");
        const dayNum = parseInt(day, 10);

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

    // Show "Shavua Tov" only after Shabbat ends on Saturday (until midnight)
    const showShavuaTov = isAfter && isSaturdayNow;

    return (
        <View style={ui.shabbatHeroWrap}>
            {/* ========================================
                STATE 1: DURING SHABBAT
                Friday after candle lighting through Saturday before havdalah
                ======================================== */}
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
                        <>
                            <Text style={[ui.h5, ui.textWhite, ui.textCenter]}>
                                {isSaturdayNow
                                    ? `Shabbat ends at ${formatTime(
                                          shabbatInfo.shabbatEnds
                                      )}`
                                    : `Candle lighting was at ${formatTime(
                                          shabbatInfo.candleTime
                                      )}`}
                            </Text>

                            <Pressable
                                onPress={handleShowDetails}
                                style={[ui.button, ui.buttonOutline]}
                            >
                                <Text style={ui.buttonText}>Shabbat times</Text>
                            </Pressable>
                        </>
                    ) : (
                        <>
                            <Text style={[ui.label, ui.textCenter]}>
                                Share your location for{"\n"}detailed Shabbat
                                times
                            </Text>
                            <Pressable
                                onPress={handleEnableLocation}
                                style={[ui.button, ui.buttonOutline]}
                            >
                                <Text style={ui.buttonText}>
                                    Enable location
                                </Text>
                            </Pressable>
                        </>
                    )}
                </>
            ) : showShavuaTov ? (
                /* ========================================
                   STATE 2: SHAVUA TOV
                   Saturday after Shabbat ends (until midnight)
                   ======================================== */
                <>
                    <Text
                        style={[
                            ui.h1,
                            ui.textBrand,
                            ui.textChutz,
                            ui.textCenter,
                        ]}
                    >
                        Shavua Tov
                    </Text>

                    {hasLocation && shabbatInfo?.shabbatEnds ? (
                        <>
                            <Text style={[ui.h5, ui.textWhite, ui.textCenter]}>
                                Shabbat ended at{" "}
                                {formatTime(shabbatInfo.shabbatEnds)}
                            </Text>

                            <Pressable
                                onPress={handleShowDetails}
                                style={[ui.button, ui.buttonOutline]}
                            >
                                <Text style={ui.buttonText}>Shabbat times</Text>
                            </Pressable>
                        </>
                    ) : (
                        <>
                            <Text style={[ui.label, ui.textCenter]}>
                                Share your location for{"\n"}detailed Shabbat
                                times
                            </Text>
                            <Pressable
                                onPress={handleEnableLocation}
                                style={[ui.button, ui.buttonOutline]}
                            >
                                <Text style={ui.buttonText}>
                                    Enable location
                                </Text>
                            </Pressable>
                        </>
                    )}
                </>
            ) : (
                /* ========================================
                   STATE 3: BEFORE SHABBAT
                   Sunday through Friday before candle lighting
                   ======================================== */
                <>
                    {/* Show "Erev Shabbat" on Friday, "not Shabbat" on other days */}
                    <Text style={[ui.h2, ui.textWhite, ui.textCenter]}>
                        Today is
                    </Text>

                    <Text
                        style={[
                            ui.textBrand,
                            ui.textChutz,
                            ui.textCenter,
                            {
                                fontSize: 60,
                            },
                        ]}
                    >
                        {isFridayNow ? "Erev Shabbat" : "not Shabbat"}
                    </Text>

                    {hasLocation && shabbatInfo?.candleTime ? (
                        /* User has shared location - show times and button */
                        <>
                            <Text style={[ui.h5, ui.textWhite, ui.textCenter]}>
                                {isFridayNow
                                    ? `Candle lighting is at ${formatTime(
                                          shabbatInfo.candleTime
                                      )}`
                                    : `Shabbat begins ${formatDateShort(
                                          shabbatInfo?.erevShabbatShort
                                      )}`}
                            </Text>

                            <Pressable
                                onPress={handleShowDetails}
                                style={[ui.button, ui.buttonOutline]}
                            >
                                <Text style={ui.buttonText}>Shabbat times</Text>
                            </Pressable>
                        </>
                    ) : (
                        /* User has not shared location - show date and enable prompt */
                        <>
                            {!isFridayNow && shabbatInfo?.erevShabbatShort && (
                                <Text
                                    style={[ui.h5, ui.textWhite, ui.textCenter]}
                                >
                                    Shabbat begins{" "}
                                    {formatDateShort(
                                        shabbatInfo?.erevShabbatShort
                                    )}
                                </Text>
                            )}

                            <Text style={[ui.label, ui.textCenter]}>
                                Share your location for{"\n"}detailed Shabbat
                                times
                            </Text>
                            <Pressable
                                onPress={handleEnableLocation}
                                style={[ui.button, ui.buttonOutline]}
                            >
                                <Text style={ui.buttonText}>
                                    Enable location
                                </Text>
                            </Pressable>
                        </>
                    )}
                </>
            )}
        </View>
    );
}
