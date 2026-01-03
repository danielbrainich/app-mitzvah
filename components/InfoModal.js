import React from "react";
import { Modal, Pressable, View, Text, StyleSheet } from "react-native";

export default function InfoModal({ visible, onClose, title, children }) {
    return (
        <Modal
            transparent
            visible={!!visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable style={styles.backdrop} onPress={onClose}>
                <Pressable style={styles.card} onPress={() => {}}>
                    {!!title && <Text style={styles.title}>{title}</Text>}
                    {children}
                </Pressable>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.65)",
        justifyContent: "center",
        padding: 18,
    },
    card: {
        borderWidth: 1,
        borderColor: "rgba(130,203,255,0.35)",
        backgroundColor: "rgba(0,0,0,0.92)",
        borderRadius: 14,
        padding: 16,
    },
    title: {
        color: "white",
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 14,
    },
});
