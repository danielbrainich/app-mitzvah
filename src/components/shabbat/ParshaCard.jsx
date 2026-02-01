import React, { useCallback, useMemo } from "react";
import { View, Text, Pressable, Platform, StyleSheet } from "react-native";
import { ui } from "../../constants/theme";
import * as Haptics from "expo-haptics";
import { Entypo } from "@expo/vector-icons";
import { getParshaDataByName } from "../../data/parshiot";

export default function ParshaCard({
    parshaEnglish,
    parshaHebrew,
    parshaReplacedByHoliday,
    onPress,
}) {
    const onPressDots = useCallback(() => {
        if (Platform.OS === "ios" || Platform.OS === "android") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
                () => {}
            );
        }
        onPress?.();
    }, [onPress]);

    const parshaData = useMemo(() => {
        if (!parshaEnglish) return null;
        return getParshaDataByName(parshaEnglish);
    }, [parshaEnglish]);

    const displayName = useMemo(() => {
        if (!parshaEnglish) return "";
        return parshaEnglish.replace(/^Parashat |^Parashah /, "");
    }, [parshaEnglish]);

    const verses = parshaData?.[0]?.verses;

    return (
        <View style={[ui.card, { paddingBottom: 12 }]}>
            {parshaEnglish ? (
                <View style={ui.cardHeader}>
                    <View>
                        <Pressable
                            onPress={onPressDots}
                            disabled={!onPress}
                            hitSlop={8}
                        >
                            <Text
                                style={[ui.h6, ui.textBrand]}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                            >
                                {displayName}
                            </Text>

                            {!!parshaHebrew && (
                                <Text style={ui.hebrewCardText}>
                                    {parshaHebrew}
                                </Text>
                            )}

                            {!!verses && <Text style={ui.label}>{verses}</Text>}
                        </Pressable>
                    </View>

                    {onPress && (
                        <Pressable
                            onPress={onPressDots}
                            hitSlop={12}
                            style={ui.iconButton}
                        >
                            <Entypo
                                name="dots-three-vertical"
                                size={18}
                                color="white"
                            />
                        </Pressable>
                    )}
                </View>
            ) : parshaReplacedByHoliday ? (
                <Text style={ui.paragraph}>
                    This week's holiday Torah reading replaces the parasha.
                </Text>
            ) : (
                <Text style={ui.paragraph}>Torah portion unavailable.</Text>
            )}
        </View>
    );
}
