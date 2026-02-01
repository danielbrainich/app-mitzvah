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

            {/* Erev Shabbat (Friday) */}
            <View style={{ marginBottom: 24 }}>
                <Text style={[ui.label, { marginBottom: 8 }]}>
                    Erev Shabbat
                </Text>

                <Text style={[ui.h6, ui.textWhite, { marginBottom: 12 }]}>
                    {shabbatInfo.erevShabbatShort}
                </Text>

                {shabbatInfo.candleTime && (
                    <>
                        <View style={[ui.row, { marginBottom: 8 }]}>
                            <Text style={ui.textWhite}>Candle lighting</Text>
                            <Text style={[ui.textWhite, { fontWeight: "600" }]}>
                                {formatTime(shabbatInfo.candleTime)}
                            </Text>
                        </View>

                        {shabbatInfo.fridaySunset && (
                            <Text style={[ui.label, { fontSize: 13 }]}>
                                {candleMins} minutes before{" "}
                                {formatTime(shabbatInfo.fridaySunset)} sundown
                            </Text>
                        )}
                    </>
                )}
            </View>

            <View style={ui.divider} />

            {/* Yom Shabbat (Saturday) */}
            <View style={{ marginTop: 24 }}>
                <Text style={[ui.label, { marginBottom: 8 }]}>Yom Shabbat</Text>

                <Text style={[ui.h6, ui.textWhite, { marginBottom: 12 }]}>
                    {shabbatInfo.yomShabbatShort}
                </Text>

                {shabbatInfo.shabbatEnds && (
                    <>
                        <View style={[ui.row, { marginBottom: 8 }]}>
                            <Text style={ui.textWhite}>Shabbat ends</Text>
                            <Text style={[ui.textWhite, { fontWeight: "600" }]}>
                                {formatTime(shabbatInfo.shabbatEnds)}
                            </Text>
                        </View>

                        {shabbatInfo.saturdaySunset && (
                            <Text style={[ui.label, { fontSize: 13 }]}>
                                {havdalahMins} minutes after{" "}
                                {formatTime(shabbatInfo.saturdaySunset)} sundown
                            </Text>
                        )}
                    </>
                )}
            </View>
        </BottomSheetDrawerBase>
    );
}
