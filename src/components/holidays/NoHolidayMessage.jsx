import React from "react";
import { View, Text } from "react-native";
import { ui } from "../../constants/theme";

export default function NoHolidayMessage() {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 22,
            }}
        >
            <Text style={ui.holidaysHeaderText}>Today is</Text>
            <Text
                style={[
                    ui.holidaysBigBoldText,
                    ui.textChutz,
                    { textAlign: "center" },
                ]}
            >
                not a Jewish holiday
            </Text>
        </View>
    );
}
