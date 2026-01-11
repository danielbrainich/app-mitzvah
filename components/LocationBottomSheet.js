// components/LocationBottomSheet.js
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
            contentContainerStyle={{
                paddingHorizontal: 16,
                paddingBottom: 22,
            }}
        >
            <Text style={ui.bottomSheetTitle}>{title}</Text>
            <View style={{ height: 12 }} />
            {children}
        </BottomSheetDrawerBase>
    );
}
