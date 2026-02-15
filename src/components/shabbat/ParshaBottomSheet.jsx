import React from "react";
import { View, Text, StyleSheet } from "react-native";
import BottomSheetDrawerBase from "../common/BottomSheetDrawerBase";
import { ui } from "../../constants/theme";

export default function ParshaBottomSheet({
    visible,
    onClose,
    parshiot,
    snapPoints = ["35%", "65%"],
}) {
    if (!parshiot || parshiot.length === 0) return null;

    return (
        <BottomSheetDrawerBase
            visible={visible}
            onClose={onClose}
            snapPoints={snapPoints}
            defaultIndex={0}
            contentContainerStyle={ui.sheetBody}
        >
            {parshiot.map((parsha, index) => (
                <View key={parsha.key}>
                    {index > 0 && (
                        <View style={[
                            ui.divider,
                            {
                                height: 1,
                                backgroundColor: "rgba(255,255,255,0.25)",
                                marginTop: 24,
                                marginBottom: 24,
                            },
                        ]} />
                    )}

                    <View style={ui.sheetHeader}>
                        <Text style={[ui.h6, ui.textBrand]}>
                            {parsha.english}
                        </Text>
                        <Text style={ui.hebrewCardText}>{parsha.hebrew}</Text>
                        <Text style={ui.label}>{parsha.verses}</Text>
                    </View>

                    <View style={ui.divider} />

                    <Text style={ui.paragraph}>{parsha.blurb}</Text>
                </View>
            ))}
        </BottomSheetDrawerBase>
    );
}
