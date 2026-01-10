import React, { useEffect, useMemo, useRef, useCallback } from "react";
import { View, Text, Pressable } from "react-native";
import {
    BottomSheetModal,
    BottomSheetView,
    BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { Entypo } from "@expo/vector-icons";

import { ui } from "../styles/theme";

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
            onDismiss={handleDismiss}
            enablePanDownToClose
            backgroundStyle={ui.bottomSheetBg}
            handleIndicatorStyle={ui.bottomSheetHandle}
            backdropComponent={renderBackdrop}
        >
            <BottomSheetView style={ui.bottomSheetContent}>
                <View style={ui.bottomSheetHeaderRow}>
                    <Text style={ui.bottomSheetTitle} numberOfLines={2}>
                        {title ?? ""}
                    </Text>

                    <Pressable
                        onPress={() => modalRef.current?.dismiss()}
                        hitSlop={12}
                        accessibilityRole="button"
                        accessibilityLabel="Close"
                        style={ui.bottomSheetCloseBtn}
                    >
                        <Entypo name="cross" size={18} color="white" />
                    </Pressable>
                </View>

                {children}
            </BottomSheetView>
        </BottomSheetModal>
    );
}
