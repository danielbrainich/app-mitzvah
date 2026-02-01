import React from "react";
import { View, Text, Pressable, Linking, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { Entypo } from "@expo/vector-icons";
import { ui } from "../../constants/theme";

export default function ShabbatHero({
    status,
    hasLocation,
    shabbatInfo,
    candleMins, // unused here, but OK to keep for future
    havdalahMins, // unused here, but OK to keep for future
    now,
    onShowDetails,
}) {
    const {
        isBefore = false,
        isDuring = false,
        isAfter = false,
    } = status ?? {};

    // ✅ one knob for vertical symmetry around the big blue line
    const GAP = 12;
    const Spacer = () => <View style={{ height: GAP }} />;

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

    // Shavua Tov only after Shabbat ends, and only on Saturday (until midnight)
    const showShavuaTov = isAfter && isSaturdayNow;

    return (
        <View style={ui.shabbatHeroWrap}>
            {/* DURING SHABBAT */}
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
                                    style={[
                                        ui.h5,
                                        ui.textWhite,
                                        ui.textCenter,
                                        { marginBottom: 0 },
                                    ]}
                                >
                                    Shabbat ends{" "}
                                    {isSaturdayNow ? "today" : "Saturday"} at{" "}
                                    {formatTime(shabbatInfo.shabbatEnds)}
                                </Text>
                                <Pressable
                                    onPress={handleShowDetails}
                                    hitSlop={12}
                                    style={[{ paddingTop: 4 }, { paddingLeft: 2}]}
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
                        <View>
                            <Text style={[ui.paragraph, ui.textCenter]}>
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
                        </View>
                    )}
                </>
            ) : showShavuaTov ? (
                /* SATURDAY AFTER SHABBAT: Show Shavua Tov until midnight */
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
                                    style={[
                                        ui.h5,
                                        ui.textWhite,
                                        ui.textCenter,
                                        { marginBottom: 0 },
                                    ]}
                                >
                                    Shabbat ended today at{" "}
                                    {formatTime(shabbatInfo.shabbatEnds)}
                                </Text>
                                <Pressable
                                    onPress={handleShowDetails}
                                    hitSlop={12}
                                    style={[{ paddingTop: 4 }, { paddingLeft: 2}]}
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
                        <Text
                            style={[
                                ui.h5,
                                ui.textWhite,
                                ui.textCenter,
                                { marginTop: 12, marginBottom: 0 },
                            ]}
                        >
                            Have a good week
                        </Text>
                    )}
                </>
            ) : (
                /* BEFORE SHABBAT (or after Shabbat on non-Saturday) */
                <>
                    {/* Friday: Show "this evening" */}
                    {isFridayNow ? (
                        <>
                            <Text
                                style={[
                                    ui.h2,
                                    ui.textWhite,
                                    ui.textCenter,
                                    { marginBottom: 0 },
                                ]}
                            >
                                Shabbat begins
                            </Text>

                            {/* ✅ symmetric spacing around the big blue line */}
                            <Spacer />

                            <Text
                                style={[
                                    ui.h3,
                                    ui.textBrand,
                                    ui.textChutz,
                                    ui.textCenter,
                                    { marginTop: 0, marginBottom: 0 },
                                ]}
                            >
                                this evening
                            </Text>

                            <Spacer />
                        </>
                    ) : (
                        <>
                            <Text
                                style={[
                                    ui.h2,
                                    ui.textWhite,
                                    ui.textCenter,
                                    { marginBottom: 0 },
                                ]}
                            >
                                Next Shabbat begins
                            </Text>

                            {/* ✅ symmetric spacing around the big blue line */}
                            <Spacer />

                            <Text
                                style={[
                                    ui.h3,
                                    ui.textBrand,
                                    ui.textChutz,
                                    ui.textCenter,
                                    { marginTop: 0, marginBottom: 0 },
                                ]}
                            >
                                {formatDateShort(shabbatInfo?.erevShabbatShort)}
                            </Text>

                            <Spacer />
                        </>
                    )}

                    {hasLocation && shabbatInfo?.candleTime ? (
                        <View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 6,
                                }}
                            >
                                <Text
                                    style={[
                                        ui.h5,
                                        ui.textWhite,
                                        ui.textCenter,
                                        { marginBottom: 0 },
                                    ]}
                                >
                                    Candle lighting at{" "}
                                    {formatTime(shabbatInfo.candleTime)}
                                </Text>
                                <Pressable
                                    onPress={handleShowDetails}
                                    hitSlop={12}
                                    style={[{ paddingTop: 4 }, { paddingLeft: 2}]}
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
                        <View>
                            <Text style={[ui.paragraph, ui.textCenter]}>
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
                        </View>
                    )}
                </>
            )}
        </View>
    );
}
