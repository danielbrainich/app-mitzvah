import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
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
            {hasHeader && (
                <>
                    <View style={ui.sheetHeader}>
                        {!!nameLeft && (
                            <Text style={[ui.h6, ui.textBrand]}>
                                {`Parashat ${nameLeft}`}
                            </Text>
                        )}

                        {!!nameRight && (
                            <Text style={styles.hebrewText}>
                                {`פרשת ${nameRight}`}
                            </Text>
                        )}
                    </View>

                    <View style={ui.divider} />
                </>
            )}

            {!!verses && <Text style={ui.label}>{verses}</Text>}

            {!!blurb && <Text style={ui.paragraph}>{blurb}</Text>}
        </BottomSheetDrawerBase>
    );
}

const styles = StyleSheet.create({
    hebrewText: {
        fontSize: 16,
        color: "#82CBFF",
        writingDirection: "rtl",
        textAlign: "left",
        marginTop: 3,
    },
});
