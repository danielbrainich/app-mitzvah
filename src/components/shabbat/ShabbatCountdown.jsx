import React from "react";
import { View, Text } from "react-native";
import { ui } from "../../constants/theme";

function unitLabel(paddedStr, singular, plural) {
    const n = Number(paddedStr);
    return n === 1 ? singular : plural;
}

function CountdownUnit({ value, label }) {
    const displayLabel = unitLabel(value, label, `${label}s`);
    return (
        <View style={ui.shabbatCountdownItem}>
            <Text style={ui.shabbatCountdownNumber}>{value}</Text>
            <Text style={ui.shabbatCountdownLabel}>{displayLabel}</Text>
        </View>
    );
}

export default function ShabbatCountdown({ parts }) {
    if (!parts) return null;

    return (
        <View style={ui.shabbatCountdownCard}>
            <CountdownUnit value={parts.days} label="Day" />
            <CountdownUnit value={parts.hours} label="Hour" />
            <CountdownUnit value={parts.mins} label="Minute" />
        </View>
    );
}
