import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const Stepper = ({ value, onIncrement, onDecrement }) => {
    return (
        <View style={styles.stepperContainer}>
            <TouchableOpacity onPress={onDecrement} style={styles.button}>
                <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.valueText}>{value}</Text>
            <TouchableOpacity onPress={onIncrement} style={styles.button}>
                <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    stepperContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    button: {
        width: 25,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
    },
    buttonText: {
        fontSize: 18,
        color: "white",
    },
    valueText: {
        marginHorizontal: 5,
        fontSize: 18,
        color: "white",
    },
});

export default Stepper;
