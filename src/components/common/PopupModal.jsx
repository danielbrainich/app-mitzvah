import React from "react";
import { Modal, View, Text, Pressable } from "react-native";
import { ui } from "../../constants/theme";
import * as Haptics from "expo-haptics";

export default function PopupModal({
    visible,
    title,
    message,
    primaryLabel = "OK",
    secondaryLabel,
    onPrimary,
    onSecondary,
    onClose,
}) {
    return (
        <Modal
            visible={!!visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable
                style={ui.popupBackdrop}
                onPress={onClose}
                accessibilityRole="button"
            >
                {/* stop propagation so taps on the card don't close */}
                <Pressable
                    onPress={() => {}}
                    style={ui.popupCard}
                    accessibilityRole="none"
                >
                    {!!title && (
                        <Text
                            style={[ui.h6, ui.textWhite, { marginBottom: 8 }]}
                        >
                            {title}
                        </Text>
                    )}

                    {!!message && (
                        <Text
                            style={[
                                ui.paragraph,
                                { marginTop: 0, opacity: 0.9 },
                            ]}
                        >
                            {message}
                        </Text>
                    )}

                    <View style={{ marginTop: 16, gap: 10 }}>
                        <Pressable
                            style={[ui.button, { marginTop: 0 }]}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                onPrimary?.();
                                onClose?.();
                            }}                        >
                            <Text style={ui.buttonText}>{primaryLabel}</Text>
                        </Pressable>

                        {!!secondaryLabel && (
                            <Pressable
                                style={[
                                    ui.button,
                                    ui.buttonOutline,
                                    { marginTop: 0 },
                                ]}
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    onSecondary?.();
                                    onClose?.();
                                }}                            >
                                <Text style={ui.buttonText}>
                                    {secondaryLabel}
                                </Text>
                            </Pressable>
                        )}
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
}
