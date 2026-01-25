import React from "react";
import { View, Text } from "react-native";
import { ui } from "../../constants/theme";

export default function LoadingCard({ loading }) {
    return (
        <View style={ui.card}>
            <Text style={ui.paragraph}>
                {loading ? "Loading Shabbat info..." : "No Shabbat info."}
            </Text>
        </View>
    );
}
