import React, { useState, useCallback } from "react";
import { View, Text, Pressable, Platform } from "react-native";
import { Entypo } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { ui, colors } from "../../constants/theme";
import { formatTime12h } from "../../utils/datetime";

function RowLine({ label, value }) {
    return (
        <View style={ui.shabbatTimeRow}>
            <Text style={ui.paragraph}>{label}</Text>
            <Text style={ui.shabbatTimeValue}>{value}</Text>
        </View>
    );
}

function SectionHeader({ day, gregDate, hebDate }) {
    const [showHebrew, setShowHebrew] = useState(false);

    const handleToggle = useCallback(() => {
        if (Platform.OS === "ios" || Platform.OS === "android") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
                () => {}
            );
        }
        setShowHebrew((v) => !v);
    }, []);

    return (
        <View style={ui.shabbatSectionHeader}>
            <Text style={[ui.h6, ui.textBrand]}>{day}</Text>
            <Pressable onPress={handleToggle} hitSlop={12}>
                <View style={ui.sheetDateToggle}>
                    <Entypo name="cycle" size={13} color={colors.muted} />
                    <Text style={ui.label} numberOfLines={1}>
                        {showHebrew ? hebDate : gregDate}
                    </Text>
                </View>
            </Pressable>
        </View>
    );
}

export default function ShabbatTimesCard({
    shabbatInfo,
    onParshaPress,
    loading,
}) {
    const dash = "—";

    // Show loading state
    if (loading) {
        return (
            <View style={ui.card}>
                <Text style={ui.paragraph}>Loading Shabbat times...</Text>
            </View>
        );
    }

    // Show error/empty state if no data
    if (!shabbatInfo) {
        return (
            <View style={ui.card}>
                <Text style={ui.paragraph}>
                    Unable to load Shabbat information.
                </Text>
            </View>
        );
    }

    // Normal rendering with dashes for missing times
    const candleValue = shabbatInfo?.candleTime
        ? formatTime12h(shabbatInfo.candleTime)
        : dash;

    const friSundownValue = shabbatInfo?.fridaySunset
        ? formatTime12h(shabbatInfo.fridaySunset)
        : dash;

    const satSundownValue = shabbatInfo?.saturdaySunset
        ? formatTime12h(shabbatInfo.saturdaySunset)
        : dash;

    const endsValue = shabbatInfo?.shabbatEnds
        ? formatTime12h(shabbatInfo.shabbatEnds)
        : dash;

    const canShowParsha =
        !!shabbatInfo?.parshaEnglish &&
        !!shabbatInfo?.parshaHebrew &&
        !shabbatInfo?.parshaReplacedByHoliday;

    return (
        <View style={ui.card}>
            {/* Friday Section */}
            <SectionHeader
                day="Friday"
                gregDate={shabbatInfo.erevShabbatGregDate || dash}
                hebDate={shabbatInfo.erevShabbatHebrewDate || dash}
            />
            <RowLine label="Candle lighting" value={candleValue} />
            <RowLine label="Sundown" value={friSundownValue} />

            <View style={ui.divider} />

            {/* Saturday Section */}
            <SectionHeader
                day="Saturday"
                gregDate={shabbatInfo.yomShabbatGregDate || dash}
                hebDate={shabbatInfo.yomShabbatHebrewDate || dash}
            />
            <RowLine label="Sundown" value={satSundownValue} />
            <RowLine label="Shabbat ends" value={endsValue} />

            <View style={ui.divider} />

            {/* Parasha Section */}
            {canShowParsha ? (
                <View style={ui.shabbatParshaRow}>
                    <View style={ui.shabbatParshaText}>
                        <Text style={ui.paragraph}>Torah portion: </Text>
                        <Pressable onPress={onParshaPress} hitSlop={12}>
                            <Text style={ui.paragraph}>
                            {shabbatInfo.parshaEnglish?.replace(/^Parashat\s+/i, "")}
                            </Text>
                        </Pressable>
                    </View>

                    <Pressable
                        onPress={onParshaPress}
                        hitSlop={12}
                        style={ui.shabbatParshaButton}
                    >
                        <Entypo
                            name="dots-three-vertical"
                            size={18}
                            color="white"
                        />
                    </Pressable>
                </View>
            ) : shabbatInfo?.parshaReplacedByHoliday ? (
                <Text style={ui.paragraph}>
                    This week's holiday Torah reading replaces the parasha.
                </Text>
            ) : (
                <Text style={ui.paragraph}>Torah portion unavailable.</Text>
            )}
        </View>
    );
}
