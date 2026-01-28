import React, { useEffect, useRef } from "react";
import {
    View,
    Text,
    Pressable,
    Animated,
    StyleSheet,
    Platform,
    useWindowDimensions,
} from "react-native";
import * as Haptics from "expo-haptics";
import { colors, typography, radii } from "../constants/design-tokens";

export default function CustomTabBar({ state, descriptors, navigation }) {
    const { width } = useWindowDimensions();
    const slideAnim = useRef(new Animated.Value(0)).current;

    const containerWidth = width - 80;
    const tabWidth = containerWidth / state.routes.length;
    const indicatorWidth = tabWidth - 16;

    useEffect(() => {
        Animated.spring(slideAnim, {
            toValue: state.index * tabWidth + 8,
            useNativeDriver: false,
            tension: 40,
            friction: 14,
        }).start();
    }, [state.index, tabWidth]);

    const handlePress = (route, isFocused) => {
        if (Platform.OS === "ios" || Platform.OS === "android") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
                () => {}
            );
        }
        if (!isFocused) {
            navigation.navigate(route.name);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.tabBar}>
                <Animated.View
                    style={[
                        styles.indicator,
                        { width: indicatorWidth, left: slideAnim },
                    ]}
                />

                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const label = options.tabBarLabel ?? route.name;
                    const isFocused = state.index === index;

                    return (
                        <Pressable
                            key={route.key}
                            onPress={() => handlePress(route, isFocused)}
                            style={[styles.tab, { width: tabWidth }]}
                        >
                            <Text
                                style={[
                                    styles.label,
                                    isFocused && styles.labelActive,
                                ]}
                            >
                                {label}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        left: 40,
        right: 40,
        bottom: 23,
    },
    tabBar: {
        flexDirection: "row",
        backgroundColor: colors.background.secondary,
        borderRadius: radii.lg,
        height: 64,
        position: "relative",
    },
    indicator: {
        position: "absolute",
        top: 8,
        bottom: 8,
        backgroundColor: "#313131",
        borderRadius: radii.sm,
    },
    tab: {
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1,
    },
    label: {
        fontSize: typography.size.md,
        fontWeight: typography.weight.medium,
        color: colors.text.muted,
    },
    labelActive: {
        color: colors.text.primary,
    },
});
