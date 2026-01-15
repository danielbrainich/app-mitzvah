// components/BottomSheetDrawerBase.js
import React, { useEffect, useMemo, useRef, useCallback } from "react";
import { View, Pressable } from "react-native";
import {
    BottomSheetModal,
    BottomSheetView,
    BottomSheetBackdrop,
    BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { Entypo } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { ui } from "../styles/theme";

export default function BottomSheetDrawerBase({
    visible,
    onClose,
    snapPoints = ["35%", "65%"],
    defaultIndex = 0, // 0 = shorter (first snap point), 1 = taller (second snap point)
    children,
    contentContainerStyle,
}) {
    const modalRef = useRef(null);
    const points = useMemo(() => snapPoints, [snapPoints]);
    const handleDismiss = useCallback(() => onClose?.(), [onClose]);

    useEffect(() => {
        if (visible) modalRef.current?.present();
        else modalRef.current?.dismiss();
    }, [visible]);

    const renderBackdrop = useCallback(
        (props) => (
            <BottomSheetBackdrop
                {...props}
                appearsOnIndex={0}
                disappearsOnIndex={-1}
                pressBehavior="close"
                opacity={0.75}
            />
        ),
        []
    );

    return (
        <BottomSheetModal
            ref={modalRef}
            snapPoints={points}
            index={defaultIndex}
            onDismiss={handleDismiss}
            enablePanDownToClose
            backgroundStyle={ui.bottomSheetBg}
            handleIndicatorStyle={ui.bottomSheetHandle}
            backdropComponent={renderBackdrop}
            enableDynamicSizing={false} 
        >
            <BottomSheetView style={ui.bottomSheetContent}>
                {/* Top row: close button only */}
                <View style={ui.sheetTopRow}>
                    <Pressable
                        onPress={() => {
                            modalRef.current?.dismiss();
                            Haptics.impactAsync(
                                Haptics.ImpactFeedbackStyle.Light
                            );
                        }}
                        hitSlop={12}
                        accessibilityRole="button"
                        accessibilityLabel="Close"
                        style={ui.bottomSheetCloseBtn}
                    >
                        <Entypo name="cross" size={24} color="white" />
                    </Pressable>
                </View>

                <BottomSheetScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={contentContainerStyle}
                >
                    {children}
                </BottomSheetScrollView>
            </BottomSheetView>
        </BottomSheetModal>
    );
}
