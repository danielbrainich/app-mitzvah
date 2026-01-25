import React, { useEffect, useMemo, useRef, useCallback } from "react";
import {
    BottomSheetModal,
    BottomSheetView,
    BottomSheetBackdrop,
    BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { ui } from "../constants/theme"

export default function BottomSheetDrawerBase({
    visible,
    onClose,
    snapPoints = ["35%", "65%"],
    defaultIndex = 0,
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
