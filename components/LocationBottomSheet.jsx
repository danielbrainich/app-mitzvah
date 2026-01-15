import React from "react";
import { View, Text } from "react-native";
import BottomSheetDrawerBase from "./BottomSheetDrawerBase";
import { ui } from "../styles/theme";

export default function LocationBottomSheet({
    visible,
    onClose,
    title = "Your Location",
    snapPoints = ["35%", "65%"],
    children,
}) {
    return (
        <BottomSheetDrawerBase
            visible={visible}
            onClose={onClose}
            snapPoints={snapPoints}
            defaultIndex={0}
            contentContainerStyle={ui.locationSheetBody}
        >
            <Text style={ui.locationSheetTitle}>{title}</Text>
            <View style={ui.locationSheetSpacer} />
            {children}
        </BottomSheetDrawerBase>
    );
}
