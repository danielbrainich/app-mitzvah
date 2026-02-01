import React from "react";
import { View, Text } from "react-native";
import BottomSheetDrawerBase from "../common/BottomSheetDrawerBase";
import { ui } from "../../constants/theme";

export default function ShabbatTimesBottomSheet({
    visible,
    onClose,
    shabbatInfo,
    candleMins,
    havdalahMins,
    snapPoints = ["35%", "55%"],
}) {
    // Format time nicely (e.g., "7:23 PM")
    const formatTime = (date) => {
        if (!(date instanceof Date)) return "";
        return new Intl.DateTimeFormat("en-US", {
            hour: "numeric",
            minute: "2-digit",
        }).format(date);
    };

    if (!shabbatInfo) return null;

    return (
        <BottomSheetDrawerBase
            visible={visible}
            onClose={onClose}
            snapPoints={snapPoints}
            defaultIndex={0}
            contentContainerStyle={ui.sheetBody}
        >
            <View style={ui.sheetHeader}>
                <Text style={[ui.h6, ui.textBrand]}>Shabbat Times</Text>
            </View>

            <View style={ui.divider} />

            {/* Friday Times */}
            <View style={ui.mb5}>
                <Text style={[ui.label, ui.mb2]}>
                    {shabbatInfo.erevShabbatShort}
                </Text>

                {shabbatInfo.candleTime && (
                    <View style={[ui.row, ui.mb2]}>
                        <Text style={ui.textWhite}>Candle lighting</Text>
                        <Text style={ui.textWhite}>
                            {formatTime(shabbatInfo.candleTime)}
                        </Text>
                    </View>
                )}

                {shabbatInfo.fridaySunset && (
                    <View style={[ui.row, ui.mb1]}>
                        <Text style={ui.label}>Sundown</Text>
                        <Text style={ui.label}>
                            {formatTime(shabbatInfo.fridaySunset)}
                        </Text>
                    </View>
                )}
            </View>

            {/* Saturday Times */}
            <View>
                <Text style={[ui.label, ui.mb2]}>
                    {shabbatInfo.yomShabbatShort}
                </Text>

                {shabbatInfo.shabbatEnds && (
                    <View style={[ui.row, ui.mb2]}>
                        <Text style={ui.textWhite}>Shabbat ends</Text>
                        <Text style={ui.textWhite}>
                            {formatTime(shabbatInfo.shabbatEnds)}
                        </Text>
                    </View>
                )}

                {shabbatInfo.saturdaySunset && (
                    <View style={[ui.row, ui.mb1]}>
                        <Text style={ui.label}>Sundown</Text>
                        <Text style={ui.label}>
                            {formatTime(shabbatInfo.saturdaySunset)}
                        </Text>
                    </View>
                )}
            </View>
        </BottomSheetDrawerBase>
    );
}
