import React, { useMemo } from "react";
import { View, Text } from "react-native";
import BottomSheetDrawerBase from "../common/BottomSheetDrawerBase";
import { ui } from "../../constants/theme";

function stripParshaEnglish(name) {
    if (!name) return "";
    return String(name)
        .replace(/^\s*parash(at|a|ah)?\s+/i, "")
        .replace(/^\s*parsha\s+/i, "")
        .trim();
}

function stripParshaHebrew(name) {
    if (!name) return "";
    return String(name)
        .replace(/^\s*פרשת\s+/, "")
        .trim();
}

export default function ParshaBottomSheet({
    visible,
    onClose,
    english,
    hebrew,
    verses,
    blurb,
    snapPoints = ["45%", "80%"],
}) {
    const nameLeft = useMemo(() => stripParshaEnglish(english), [english]);
    const nameRight = useMemo(() => stripParshaHebrew(hebrew), [hebrew]);

    const hasHeader = !!(nameLeft || nameRight);

    return (
        <BottomSheetDrawerBase
            visible={visible}
            onClose={onClose}
            snapPoints={snapPoints}
            defaultIndex={0}
            contentContainerStyle={ui.sheetBody}
        >
            {hasHeader ? (
                <>
                    <View style={ui.sheetHeader}>
                        {!!nameLeft ? (
                            <Text style={[ui.h5, ui.textBrand]}>
                                {`Parashat ${nameLeft}`}
                            </Text>
                        ) : null}

                        {!!nameRight ? (
                            <Text
                                style={[
                                    ui.textBase,
                                    ui.textBrand,
                                    ui.textHebrew,
                                ]}
                            >
                                {`פרשת ${nameRight}`}
                            </Text>
                        ) : null}
                    </View>

                    <View style={ui.divider} />
                </>
            ) : null}

            {!!verses ? (
                <Text style={[ui.textBase, ui.textMuted, { marginBottom: 8 }]}>
                    {verses}
                </Text>
            ) : null}

            {!!blurb ? (
                <Text style={[ui.textBody, ui.textWhite, { paddingTop: 0 }]}>
                    {blurb}
                </Text>
            ) : null}
        </BottomSheetDrawerBase>
    );
}
