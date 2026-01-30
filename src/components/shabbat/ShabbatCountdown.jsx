import React from "react";
import { View, Text } from "react-native";
import { ui } from "../../constants/theme";

export default function ShabbatCountdown({ parts }) {
    const showDays = parts.days > 0;
    const showHours = parts.days > 0 || parts.hours > 0;

    return (
        <View style={ui.shabbatCountdownCard}>
            {showDays && (
                <View style={ui.shabbatCountdownItem}>
                    <Text style={ui.shabbatCountdownNumber}>
                        {parts.daysStr}
                    </Text>
                    <Text style={[ui.label, ui.textCenter]}>Days</Text>
                </View>
            )}
            {showHours && (
                <View style={ui.shabbatCountdownItem}>
                    <Text style={ui.shabbatCountdownNumber}>
                        {parts.hoursStr}
                    </Text>
                    <Text style={[ui.label, ui.textCenter]}>Hours</Text>
                </View>
            )}
            <View style={ui.shabbatCountdownItem}>
                <Text style={ui.shabbatCountdownNumber}>{parts.minsStr}</Text>
                <Text style={[ui.label, ui.textCenter]}>Mins</Text>
            </View>
        </View>
    );
}
