import React from "react";
import { View, Text } from "react-native";
import { ui } from "../../constants/theme";

export default function ShabbatHero({ isDuring }) {
    return (
        <View style={ui.shabbatHeroWrap}>
            {isDuring ? (
                <Text style={[ui.h1, ui.textBrand, ui.textChutz]}>
                    Shabbat Shalom
                </Text>
            ) : (
                <Text style={[ui.h2, ui.textWhite]}>Shabbat begins in</Text>
            )}
        </View>
    );
}
