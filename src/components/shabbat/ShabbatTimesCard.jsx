import React from "react";
import { View, Text, Pressable } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { ui, colors } from "../../constants/theme";
import { formatTime12h } from "../../utils/datetime";

function RowLine({ label, value }) {
    return (
        <View style={ui.row}>
            <Text style={ui.shabbatSheetLabel}>{label}</Text>
            <Text style={ui.shabbatSheetValue}>{value}</Text>
        </View>
    );
}

export default function ShabbatTimesCard({ shabbatInfo, onParshaPress }) {
    const dash = "—";

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
        <View style={[ui.card, { marginBottom: 10 }]}>
            {/* Friday Section */}
            <View style={ui.shabbatSectionHeaderRow}>
                <Text style={ui.shabbatSectionHeaderLeft}>Friday</Text>
                <Text style={ui.shabbatSectionHeaderRight} numberOfLines={1}>
                    {shabbatInfo.erevShabbatGregDate}
                </Text>
            </View>

            <RowLine label="Candle lighting" value={candleValue} />
            <RowLine label="Sundown" value={friSundownValue} />

            <View style={ui.divider} />

            {/* Saturday Section */}
            <View style={ui.shabbatSectionHeaderRow}>
                <Text style={ui.shabbatSectionHeaderLeft}>Saturday</Text>
                <Text style={ui.shabbatSectionHeaderRight} numberOfLines={1}>
                    {shabbatInfo.yomShabbatGregDate}
                </Text>
            </View>

            <RowLine label="Sundown" value={satSundownValue} />
            <RowLine label="Shabbat ends" value={endsValue} />

            <View style={ui.divider} />

            {/* Parasha Section */}
            {canShowParsha ? (
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            flexShrink: 1,
                        }}
                    >
                        <Text style={ui.shabbatSentenceSmall}>
                            Torah portion:{" "}
                        </Text>
                        <Pressable onPress={onParshaPress} hitSlop={12}>
                            <Text style={ui.shabbatParshaSmall}>
                                {shabbatInfo.parshaEnglish}
                            </Text>
                        </Pressable>
                    </View>

                    <Pressable
                        onPress={onParshaPress}
                        hitSlop={12}
                        style={{ paddingLeft: 12 }}
                    >
                        <Entypo
                            name="dots-three-vertical"
                            size={16}
                            color={colors.muted}
                        />
                    </Pressable>
                </View>
            ) : (
                <Text style={[ui.shabbatSentenceSmall, { marginBottom: 0 }]}>
                    This week's holiday Torah reading replaces the parasha.
                </Text>
            )}
        </View>
    );
}
