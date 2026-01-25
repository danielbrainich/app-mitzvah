import React from "react";
import { View, Text, Pressable, Platform, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import { ui } from "../../constants/theme";
import BottomSheetDrawerBase from "../common/BottomSheetDrawerBase";

export default function LocationBottomSheet({
    visible,
    onClose,
    snapPoints,
    defaultIndex = 0,
    title = "Location",
    hasLocation,
    location,
    timezone,
    onEnableLocation,
}) {
    const handleEnablePress = () => {
        if (Platform.OS === "ios" || Platform.OS === "android") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
                () => {}
            );
        }
        onEnableLocation();
    };

    return (
        <BottomSheetDrawerBase
            visible={visible}
            onClose={onClose}
            snapPoints={snapPoints}
            defaultIndex={defaultIndex}
            contentContainerStyle={ui.sheetBody}
        >
            <View style={ui.sheetHeader}>
                <Text style={[ui.h6, ui.textBrand]}>{title}</Text>
            </View>

            <View style={ui.divider} />

            {hasLocation ? (
                <>
                    <View style={ui.shabbatTimeRow}>
                        <Text style={ui.paragraph}>Timezone</Text>
                        <Text style={styles.rowValue}>
                            {timezone?.replace(/_/g, " ") || "Unknown"}
                        </Text>
                    </View>

                    <View style={ui.shabbatTimeRow}>
                        <Text style={ui.paragraph}>Coordinates</Text>
                        <Text style={styles.rowValue}>
                            {location?.latitude != null &&
                            location?.longitude != null
                                ? `${location.latitude.toFixed(
                                      3
                                  )}, ${location.longitude.toFixed(3)}`
                                : "Unknown"}
                        </Text>
                    </View>

                    <View style={ui.shabbatTimeRow}>
                        <Text style={ui.paragraph}>Elevation</Text>
                        <Text style={styles.rowValue}>
                            {Number.isFinite(location?.elevation)
                                ? `${location.elevation.toFixed(1)} meters`
                                : "Unknown"}
                        </Text>
                    </View>
                </>
            ) : (
                <>
                    <Text style={ui.paragraph}>
                        To calculate candle lighting, sundown, and Shabbat end
                        times for your area, please enable Location Services for
                        this app.
                    </Text>

                    <Pressable
                        onPress={handleEnablePress}
                        style={[ui.button, ui.buttonOutline]}
                    >
                        <Text style={ui.buttonText}>Enable Location</Text>
                    </Pressable>
                </>
            )}
        </BottomSheetDrawerBase>
    );
}

const styles = StyleSheet.create({
    rowValue: {
        fontSize: 16,
        lineHeight: 22,
        color: "#fff",
        maxWidth: "60%",
        textAlign: "right",
    },
});
