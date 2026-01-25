import React from "react";
import { View, Text } from "react-native";
import { ui } from "../../constants/theme";

export default function ShabbatHero({ isDuring }) {
    return (
        <View style={ui.shabbatHeroWrap}>
            {isDuring ? (
                <Text style={[ui.holidaysBigBoldText, ui.textChutz]}>
                    Shabbat Shalom
                </Text>
            ) : (
                <Text style={ui.holidaysHeaderText}>Shabbat begins in</Text>
            )}
        </View>
    );
}
