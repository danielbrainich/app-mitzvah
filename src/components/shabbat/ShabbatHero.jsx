import React from "react";
import { View, Text } from "react-native";
import { ui } from "../../constants/theme";

export default function ShabbatHero({ isDuring, hasLocation }) {
    return (
        <View style={ui.shabbatHeroWrap}>
            {isDuring ? (
                <Text style={[ui.h1, ui.textBrand, ui.textChutz, ui.textCenter]}>
                    Shabbat Shalom
                </Text>
            ) : (
                <>
                    {hasLocation ? (
                        <Text style={[ui.h2, ui.textWhite]}>
                            Shabbat begins in
                        </Text>
                    ) : (
                        <View style={ui.card}>
                            <Text style={[ui.paragraph, ui.textCenter]}>
                                Enable location for detailed Shabbat times
                            </Text>
                        </View>
                    )}
                </>
            )}
        </View>
    );
}
