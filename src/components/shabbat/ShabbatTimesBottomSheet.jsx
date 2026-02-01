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
    snapPoints = ["40%", "60%"],
}) {
    const formatTime = (date) => {
        if (!(date instanceof Date)) return "";
        return new Intl.DateTimeFormat("en-US", {
            hour: "numeric",
            minute: "2-digit",
        }).format(date);
    };

    if (!shabbatInfo) return null;

    // Equal space above + below each primary time row
    const timeBlockStyle = ui.shabbatTimeBlock ?? ui.mt2;

    return (
        <BottomSheetDrawerBase
            visible={visible}
            onClose={onClose}
            snapPoints={snapPoints}
            defaultIndex={0}
            contentContainerStyle={ui.sheetBody}
        >
            {/* Header */}
            <View style={ui.mb3}>
                <Text style={[ui.h6, ui.textBrand]}>Shabbat times</Text>
            </View>

            <View style={[ui.divider, ui.mb4]} />

            {/* Friday */}
            <View style={ui.mb4}>
                {/* Smaller + tighter “blue date” (match left label size) */}
                <View style={ui.mb2}>
                    <Text style={[ui.textBody, ui.textBrand ]}>
                        {shabbatInfo.erevShabbatShort}
                    </Text>
                </View>

                {!!shabbatInfo.candleTime && (
                    <View style={timeBlockStyle}>
                        <View style={[ui.shabbatTimeRow, { alignItems: "baseline" }]}>
                            {/* Remove ui.paragraph's default marginTop so baseline aligns */}
                            <Text style={[ui.textBody, ui.textWhite]}>
                                Shabbat begins / Candle lighting
                            </Text>

                            <Text style={[ui.textBody, ui.textWhite]}>
                                {formatTime(shabbatInfo.candleTime)}
                            </Text>
                        </View>

                        {!!shabbatInfo.fridaySunset && (
                            <Text style={ui.label}>
                                {candleMins} minutes before{" "}
                                {formatTime(shabbatInfo.fridaySunset)} sundown
                            </Text>
                        )}
                    </View>
                )}
            </View>

            <View style={[ui.divider, { opacity: 0.6 }]} />

            {/* Saturday */}
            <View style={ui.mt4}>
                <View style={ui.mb2}>
                    <Text style={[ui.textBody, ui.textBrand ]}>
                        {shabbatInfo.yomShabbatShort}
                    </Text>
                </View>

                {!!shabbatInfo.shabbatEnds && (
                    <View style={timeBlockStyle}>
                        <View style={[ui.shabbatTimeRow, { alignItems: "baseline" }]}>
                            <Text style={[ui.textBody, ui.textWhite]}>
                                Shabbat ends / Havdalah
                            </Text>

                            <Text style={[ui.textBody, ui.textWhite]}>
                                {formatTime(shabbatInfo.shabbatEnds)}
                            </Text>
                        </View>

                        {!!shabbatInfo.saturdaySunset && (
                            <Text style={ui.label}>
                                {havdalahMins} minutes after{" "}
                                {formatTime(shabbatInfo.saturdaySunset)} sundown
                            </Text>
                        )}
                    </View>
                )}
            </View>
        </BottomSheetDrawerBase>
    );
}
