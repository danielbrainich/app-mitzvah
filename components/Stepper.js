import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

export default function Stepper({
    value,
    onIncrement,
    onDecrement,
    message,
    disableIncrement = false,
    disableDecrement = false,
}) {
    return (
        <View style={styles.stepperFrame}>
            <View style={styles.stepperContainer}>
                <Pressable
                    onPress={onDecrement}
                    disabled={disableDecrement}
                    accessibilityRole="button"
                    accessibilityLabel="Decrease"
                    hitSlop={10}
                    style={({ pressed }) => [
                        styles.button,
                        disableDecrement && styles.buttonDisabled,
                        pressed && !disableDecrement && styles.buttonPressed,
                    ]}
                >
                    <Text style={styles.buttonText}>-</Text>
                </Pressable>

                <Text style={styles.valueText}>{value}</Text>

                <Pressable
                    onPress={onIncrement}
                    disabled={disableIncrement}
                    accessibilityRole="button"
                    accessibilityLabel="Increase"
                    hitSlop={10}
                    style={({ pressed }) => [
                        styles.button,
                        disableIncrement && styles.buttonDisabled,
                        pressed && !disableIncrement && styles.buttonPressed,
                    ]}
                >
                    <Text style={styles.buttonText}>+</Text>
                </Pressable>
            </View>

            <Text style={styles.messageText}>{message}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    stepperFrame: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 22, 
    },
    stepperContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: 80,
    },
    button: {
        justifyContent: "center",
        alignItems: "center",
        minWidth: 32,
        minHeight: 32,
        backgroundColor: "black",
    },
    buttonPressed: {
        opacity: 0.6,
    },
    buttonDisabled: {
        opacity: 0.3,
    },
    buttonText: {
        fontSize: 16,
        color: "white",
    },
    valueText: {
        marginHorizontal: 6,
        fontSize: 16,
        color: "#82CBFF",
    },
    messageText: {
        marginStart: 8,
        fontSize: 16,
        color: "#82CBFF",
    },
});
