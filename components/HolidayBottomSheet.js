import React from "react";
import { View, Text } from "react-native";
import BottomSheetDrawerBase from "./BottomSheetDrawerBase";
import { ui } from "../styles/theme";

export default function HolidayBottomSheet({
    visible,
    onClose,
    dateLeft,
    dateRight,
    nameLeft, // English title
    nameRight, // Hebrew title
    description,
    snapPoints = ["35%", "65%"],
}) {
    return (
        <BottomSheetDrawerBase
            visible={visible}
            onClose={onClose}
            snapPoints={snapPoints}
            defaultIndex={1}
            contentContainerStyle={ui.sheetBody} // ✅ use your sheetBody padding
        >
            {/* Header */}
            <View style={ui.sheetHeader}>
                {/* Row 1: dates (muted) */}
                {dateLeft || dateRight ? (
                    <View style={ui.sheetMetaRow}>
                        <Text style={ui.sheetMetaLeft}>{dateLeft ?? ""}</Text>
                        <Text style={ui.sheetMetaRight}>{dateRight ?? ""}</Text>
                    </View>
                ) : null}

                {/* Row 2: titles (accent + bigger) */}
                {nameLeft || nameRight ? (
                    <View style={ui.sheetNameRow}>
                        <Text style={ui.sheetNameLeft} numberOfLines={2}>
                            {nameLeft ?? ""}
                        </Text>
                        <Text style={ui.sheetNameRight} numberOfLines={1}>
                            {nameRight ?? ""}
                        </Text>
                    </View>
                ) : null}
            </View>

            {/* Body */}
            <Text style={ui.todayHolidayDrawerBody}>{description ?? ""}</Text>
        </BottomSheetDrawerBase>
    );
}
