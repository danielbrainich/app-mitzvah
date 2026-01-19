import React, { useMemo, useCallback, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { HDate } from "@hebcal/core";
import { parseLocalIso, formatGregorianLongFromIso } from "../utils/datetime";
import { ui, colors } from "../styles/theme";
import * as Haptics from "expo-haptics";
import { Entypo } from "@expo/vector-icons";

export default function UpcomingHolidayCard({ holiday, hebrewDate, onAbout }) {
    const [showHebrew, setShowHebrew] = useState(Boolean(hebrewDate));

    const gregLabel = useMemo(() => {
        if (!holiday?.date) return "";
        return formatGregorianLongFromIso(holiday.date);
    }, [holiday?.date]);

    const hebLabel = useMemo(() => {
        const d = parseLocalIso(holiday?.date);
        if (!d) return "";
        return new HDate(d).toString();
    }, [holiday?.date]);

    const toggleDate = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setShowHebrew((v) => !v);
    }, []);

    const onPressDots = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onAbout?.(holiday);
    }, [onAbout, holiday]);

    return (
        <View style={[ui.card]}>
            <Text style={ui.upcomingHolidayDate}>{gregLabel}</Text>
            <Text
                style={ui.upcomingHolidayTitle}
                numberOfLines={1}
                ellipsizeMode="tail"
            >
                {holiday?.title ?? ""}
            </Text>

            {!!holiday?.hebrewTitle && (
                <Text style={ui.upcomingHolidayHebrew}>
                    {holiday.hebrewTitle}
                </Text>
            )}

            {onAbout ? (
                <Pressable
                    onPress={onPressDots}
                    hitSlop={12}
                    style={[ui.iconBtn, ui.upcomingHolidayMoreBtnPos]}
                >
                    <Entypo
                        name="dots-three-vertical"
                        size={16}
                        color="white"
                    />
                </Pressable>
            ) : null}
        </View>
    );
}
