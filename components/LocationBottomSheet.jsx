import React from "react";
import { View, Text } from "react-native";
import { ui } from "../styles/theme";
import BottomSheetDrawerBase from "./BottomSheetDrawerBase";

export default function LocationBottomSheet({
    visible,
    onClose,
    snapPoints,
    defaultIndex = 0,
    title = "Location",
    children,
}) {
    return (
        <BottomSheetDrawerBase
            visible={visible}
            onClose={onClose}
            snapPoints={snapPoints}
            defaultIndex={defaultIndex}
            contentContainerStyle={ui.sheetBody}
        >
            <View>
                <Text style={ui.sheetTitleEnglish}>{title}</Text>
            </View>

            <View style={ui.sheetDivider} />

            <View style={ui.sheetBodyContent}>{children}</View>
        </BottomSheetDrawerBase>
    );
}
