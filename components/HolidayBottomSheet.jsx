import React, { useMemo, useState, useCallback } from "react";
import { View, Text, Pressable } from "react-native";
import { Entypo } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { HDate } from "@hebcal/core";

import BottomSheetDrawerBase from "./BottomSheetDrawerBase";
import { ui, colors } from "../styles/theme";
import { parseLocalIso, formatGregorianLongFromIso } from "../utils/datetime";

export default function HolidayBottomSheet({
    visible,
    onClose,
    nameLeft,
    nameRight,
    description,
    snapPoints = ["35%", "65%"],
    isoDate,
}) {
    const [showHebrewDate, setShowHebrewDate] = useState(false);

    // ✅ normalize in case you get "YYYY-MM-DDTHH:mm:ss..."
    const isoDay = useMemo(() => {
        if (typeof isoDate !== "string") return "";
        return isoDate.length >= 10 ? isoDate.slice(0, 10) : isoDate;
    }, [isoDate]);

    const gregLabel = useMemo(() => {
        if (!isoDay) return "";
        return formatGregorianLongFromIso(isoDay);
    }, [isoDay]);

    const hebLabel = useMemo(() => {
        if (!isoDay) return "";
        const d = parseLocalIso(isoDay);
        if (!d) return "";
        return new HDate(d).toString();
    }, [isoDay]);

    const dateLabel = showHebrewDate ? hebLabel : gregLabel;

    const onToggleDate = useCallback(() => {
        if (!isoDay) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setShowHebrewDate((v) => !v);
    }, [isoDay]);

    const hasHeader = !!(nameLeft || nameRight || isoDay);

    return (
        <BottomSheetDrawerBase
            visible={visible}
            onClose={onClose}
            snapPoints={snapPoints}
            defaultIndex={0}
            contentContainerStyle={ui.sheetBody}
        >
            {hasHeader ? (
                <View style={ui.sheetHeader}>
                    {!!isoDay ? (
                        <Pressable
                            onPress={onToggleDate}
                            hitSlop={12}
                            style={ui.sheetDatePillPressable}
                        >
                            <View style={ui.sheetDatePill}>
                                <Entypo
                                    name="cycle"
                                    size={14}
                                    color={colors.muted}
                                />
                                <Text
                                    style={ui.sheetDatePillText}
                                    numberOfLines={1}
                                >
                                    {dateLabel}
                                </Text>
                            </View>
                        </Pressable>
                    ) : null}

                    {!!nameLeft && (
                        <Text style={ui.sheetTitleEnglish}>{nameLeft}</Text>
                    )}
                    {!!nameRight && (
                        <Text style={ui.sheetTitleHebrew}>{nameRight}</Text>
                    )}
                </View>
            ) : null}

            <Text style={ui.sheetBodyText}>{description ?? ""}</Text>
        </BottomSheetDrawerBase>
    );
}
