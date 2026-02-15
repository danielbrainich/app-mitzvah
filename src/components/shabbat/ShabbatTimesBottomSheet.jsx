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
    snapPoints = ["35%", "65%"],
}) {
    const formatTime = (date) => {
        if (!(date instanceof Date)) return "";
        return new Intl.DateTimeFormat("en-US", {
            hour: "numeric",
            minute: "2-digit",
        }).format(date);
    };

    if (!shabbatInfo) return null;

    const timeBlockStyle = ui.shabbatTimeBlock ?? ui.mt2;

    return (
        <BottomSheetDrawerBase
            visible={visible}
            onClose={onClose}
            snapPoints={snapPoints}
            defaultIndex={0}
            enablePanDownToClose={false}
            contentContainerStyle={ui.sheetBody}
        >
            {/* Header */}
            <View style={ui.sheetHeader}>
                <Text style={[ui.h6, ui.textBrand]}>Shabbat times</Text>
            </View>

            <View style={ui.divider} />

            {/* Friday */}
            <View style={ui.mt4}>
                <View style={ui.mb2}>
                    <Text style={[ui.textBody, ui.textBrand]}>
                        {shabbatInfo.erevShabbatShort}
                    </Text>
                </View>

                {!!shabbatInfo.candleTime && (
                    <View style={timeBlockStyle}>
                        <View
                            style={[
                                ui.shabbatTimeRow,
                                { alignItems: "baseline" },
                            ]}
                        >
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

            <View
                style={[
                    ui.divider,
                    { marginTop: 12, marginBottom: 12 },
                ]}
            />

            {/* Saturday */}
            <View>
                <View style={ui.mb2}>
                    <Text style={[ui.textBody, ui.textBrand]}>
                        {shabbatInfo.yomShabbatShort}
                    </Text>
                </View>

                {!!shabbatInfo.shabbatEnds && (
                    <View style={timeBlockStyle}>
                        <View
                            style={[
                                ui.shabbatTimeRow,
                                { alignItems: "baseline" },
                            ]}
                        >
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
