import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const Stepper = ({ value, onIncrement, onDecrement, message }) => {
    return (
        <View style={styles.stepperFrame}>
            <View style={styles.stepperContainer}>
                <TouchableOpacity onPress={onDecrement} style={styles.button}>
                    <Text style={styles.buttonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.valueText}>{value}</Text>
                <TouchableOpacity onPress={onIncrement} style={styles.button}>
                    <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.messageText}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    stepperContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: 65,
    },
    stepperFrame: {
        flexDirection: "row",
        alignItems: "center",
    },
    button: {
        justifyContent: "center",
        width: 24,
        alignItems: "center",
        backgroundColor: "black",
    },
    buttonText: {
        fontSize: 16,
        color: "white",
        marginBottom: 22,
    },
    valueText: {
        marginHorizontal: 4,
        fontSize: 16,
        color: "#82CBFF",
        marginBottom: 22,
    },
    messageText: {
        marginStart: 8,
        fontSize: 16,
        color: "#82CBFF",
        marginBottom: 22,
    },
});

export default Stepper;
