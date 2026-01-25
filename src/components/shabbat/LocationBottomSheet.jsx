import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
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
    return (
        <BottomSheetDrawerBase
            visible={visible}
            onClose={onClose}
            snapPoints={snapPoints}
            defaultIndex={defaultIndex}
            contentContainerStyle={ui.sheetBody}
        >
            <View>
                <Text style={ui.sheetTitleEnglish}>{title}</Text>
            </View>

            <View style={ui.divider} />

            <View style={ui.sheetBodyContent}>
                {hasLocation ? (
                    <>
                        <View style={ui.row}>
                            <Text style={[ui.textBase, ui.textWhite]}>
                                Timezone
                            </Text>
                            <Text
                                style={[
                                    ui.textBase,
                                    ui.textWhite,
                                    { maxWidth: "60%", textAlign: "right" },
                                ]}
                            >
                                {timezone?.replace(/_/g, " ") || "Unknown"}
                            </Text>
                        </View>

                        <View style={ui.row}>
                            <Text style={[ui.textBase, ui.textWhite]}>
                                Coordinates
                            </Text>
                            <Text
                                style={[
                                    ui.textBase,
                                    ui.textWhite,
                                    { maxWidth: "60%", textAlign: "right" },
                                ]}
                            >
                                {location?.latitude != null &&
                                location?.longitude != null
                                    ? `${location.latitude.toFixed(
                                          3
                                      )}, ${location.longitude.toFixed(3)}`
                                    : "Unknown"}
                            </Text>
                        </View>

                        <View style={ui.row}>
                            <Text style={[ui.textBase, ui.textWhite]}>
                                Elevation
                            </Text>
                            <Text
                                style={[
                                    ui.textBase,
                                    ui.textWhite,
                                    { maxWidth: "60%", textAlign: "right" },
                                ]}
                            >
                                {Number.isFinite(location?.elevation)
                                    ? `${location.elevation.toFixed(1)} meters`
                                    : "Unknown"}
                            </Text>
                        </View>
                    </>
                ) : (
                    <>
                        <Text
                            style={[
                                ui.shabbatSentenceSmall,
                                { marginBottom: 12 },
                            ]}
                        >
                            To calculate candle lighting, sundown, and Shabbat
                            end times for your area, please enable Location
                            Services for this app.
                        </Text>

                        <TouchableOpacity
                            onPress={() => {
                                onEnableLocation();
                                Haptics.impactAsync(
                                    Haptics.ImpactFeedbackStyle.Light
                                );
                            }}
                            style={[
                                ui.todayHolidayMoreInfoButton,
                                {
                                    paddingVertical: 8,
                                    paddingHorizontal: 12,
                                    borderRadius: 12,
                                    alignSelf: "flex-start",
                                    marginTop: 6,
                                },
                            ]}
                            activeOpacity={0.85}
                        >
                            <Text style={ui.todayHolidayMoreInfoButtonText}>
                                Enable Location
                            </Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </BottomSheetDrawerBase>
    );
}
