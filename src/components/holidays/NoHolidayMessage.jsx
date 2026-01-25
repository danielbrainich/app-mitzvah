import React from "react";
import { View, Text } from "react-native";
import { ui } from "../../constants/theme";

export default function NoHolidayMessage() {
    return (
        <View style={ui.centerContent}>
            <Text style={[ui.h2, ui.textWhite]}>Today is</Text>
            <Text style={[ui.h1, ui.textBrand, ui.textChutz, ui.textCenter]}>
                not a Jewish holiday
            </Text>
        </View>
    );
}
