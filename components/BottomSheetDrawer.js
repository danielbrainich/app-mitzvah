import React, { useEffect, useMemo, useRef, useCallback } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";

export default function BottomSheetDrawer({
    visible,
    onClose,
    title,
    snapPoints = ["45%", "75%"],
    children,
}) {
    const modalRef = useRef(null);
    const points = useMemo(() => snapPoints, [snapPoints]);

    const handleDismiss = useCallback(() => {
        onClose?.();
    }, [onClose]);

    useEffect(() => {
        if (visible) modalRef.current?.present();
        else modalRef.current?.dismiss();
    }, [visible]);

    return (
        <BottomSheetModal
            ref={modalRef}
            snapPoints={points}
            onDismiss={handleDismiss}
            enablePanDownToClose
            backgroundStyle={styles.sheetBg}
            handleIndicatorStyle={styles.handle}
            // If you don't want dimming:
            backdropComponent={null}
        >
            <BottomSheetView style={styles.content}>
                <View style={styles.headerRow}>
                    <Text style={styles.title} numberOfLines={2}>
                        {title ?? ""}
                    </Text>

                    <Pressable
                        onPress={() => modalRef.current?.dismiss()}
                        hitSlop={12}
                        accessibilityRole="button"
                        accessibilityLabel="Close"
                        style={styles.closeBtn}
                    >
                        <Text style={styles.closeIcon}>✕</Text>
                    </Pressable>
                </View>

                {children}
            </BottomSheetView>
        </BottomSheetModal>
    );
}

const styles = StyleSheet.create({
    sheetBg: {
        backgroundColor: "#1A1A1A",
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
    },
    handle: {
        backgroundColor: "rgba(255,255,255,0.25)",
        width: 44,
    },
    content: {
        paddingHorizontal: 16,
        paddingBottom: 22,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        paddingTop: 6,
        paddingBottom: 12,
    },
    title: {
        flex: 1,
        color: "white",
        fontSize: 18,
        fontWeight: "700",
        paddingRight: 12,
    },
    closeBtn: {
        padding: 6,
        marginTop: -2,
    },
    closeIcon: {
        color: "rgba(255,255,255,0.9)",
        fontSize: 18,
        fontWeight: "800",
    },
});
