import React from "react";
import { View, Text, Pressable, Linking, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { ui } from "../../constants/theme";

export default function ShabbatHero({ isDuring, hasLocation }) {
    const handleEnableLocation = () => {
        if (Platform.OS === "ios" || Platform.OS === "android") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
                () => {}
            );
        }
        Linking.openSettings();
    };
    return (
        <View style={ui.shabbatHeroWrap}>
            {isDuring ? (
                <Text
                    style={[ui.h1, ui.textBrand, ui.textChutz, ui.textCenter]}
                >
                    Shabbat Shalom
                </Text>
            ) : (
                <>
                    {hasLocation ? (
                        <Text style={[ui.h2, ui.textWhite]}>
                            Shabbat begins in
                        </Text>
                    ) : (
                        <>
                            <Text style={[ui.paragraph, ui.textCenter]}>
                                Enable Location Services{"\n"}for detailed Shabbat times
                            </Text>
                            <Pressable
                                onPress={handleEnableLocation}
                                style={[ui.button, ui.buttonOutline]}
                            >
                                <Text style={ui.buttonText}>
                                    Enable location
                                </Text>
                            </Pressable>
                        </>
                    )}
                </>
            )}
        </View>
    );
}
