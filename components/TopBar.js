import React, { useMemo, useState, useCallback, useEffect } from "react";
import { View, Text, Pressable, Modal, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
    formatGregorianLongFromIso,
    formatHebrewLongFromIso,
} from "../utils/datetime";
import { ui, colors } from "../styles/theme";
import * as Haptics from "expo-haptics";
import { Entypo } from "@expo/vector-icons";

// Must be exported from your useTodayIsoDay file
import {
    setDevOverrideIsoDate,
    getDevOverrideIsoDate,
} from "../hooks/useTodayIsoDay";

const TOPBAR_H = 44;

function parseIsoToDate(iso) {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d);
}

function dateToIsoLocal(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

export function TopBar({ todayIso }) {
    const navigation = useNavigation();
    const [showHebrew, setShowHebrew] = useState(false);

    // DEV date modal state
    const [devOpen, setDevOpen] = useState(false);
    const [pickerDate, setPickerDate] = useState(() =>
        parseIsoToDate(todayIso)
    );
    const [devOverrideIso, setDevOverrideIso] = useState(null);

    useEffect(() => {
        if (!__DEV__) return;
        getDevOverrideIsoDate()
            .then(setDevOverrideIso)
            .catch(() => {});
    }, []);

    const label = useMemo(() => {
        return showHebrew
            ? formatHebrewLongFromIso(todayIso)
            : formatGregorianLongFromIso(todayIso);
    }, [todayIso, showHebrew]);

    const openDev = useCallback(async () => {
        if (!__DEV__) return;

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        const current = await getDevOverrideIsoDate();
        setDevOverrideIso(current);

        const baseIso = current || todayIso;
        setPickerDate(parseIsoToDate(baseIso));

        setDevOpen(true);
    }, [todayIso]);

    const closeDev = useCallback(() => setDevOpen(false), []);

    const saveDev = useCallback(async () => {
        const iso = dateToIsoLocal(pickerDate);
        await setDevOverrideIsoDate(iso);
        setDevOverrideIso(iso);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setDevOpen(false);
    }, [pickerDate]);

    const resetDev = useCallback(async () => {
        await setDevOverrideIsoDate(null);
        setDevOverrideIso(null);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setDevOpen(false);
    }, []);

    const showDevBadge = __DEV__ && !!devOverrideIso;

    return (
        <SafeAreaView edges={["top", "left", "right"]} style={ui.topBarSafe}>
            <View style={[ui.topBarWrap, { height: TOPBAR_H }]}>
                {/* LEFT: Date pill */}
                <Pressable
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setShowHebrew((v) => !v);
                    }}
                    onLongPress={() => {
                        // DEV shortcut: long press date pill opens debug picker
                        if (__DEV__) openDev();
                    }}
                    hitSlop={12}
                    style={ui.topBarDatePressable}
                >
                    <View style={ui.topBarDatePill}>
                        <Entypo name="cycle" size={14} color={colors.muted} />
                        <Text style={ui.topBarDateText} numberOfLines={1}>
                            {label}
                        </Text>

                        {showDevBadge ? <View style={ui.topBarDevDot} /> : null}
                    </View>
                </Pressable>

                {/* DEV kebab (only in dev) */}
                {__DEV__ ? (
                    <Pressable
                        onPress={openDev}
                        hitSlop={12}
                        style={[ui.topBarIconBtn, ui.topBarKebabBtn]}
                    >
                        <Entypo
                            name="dots-three-vertical"
                            size={18}
                            color="#fff"
                        />
                    </Pressable>
                ) : null}

                {/* RIGHT: Gear */}
                <Pressable
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        navigation.navigate("Settings");
                    }}
                    hitSlop={12}
                    style={[ui.topBarIconBtn, ui.topBarGearBtn]}
                >
                    <Entypo name="cog" size={22} color="#fff" />
                </Pressable>
            </View>

            {/* DEV modal */}
            {__DEV__ ? (
                <Modal
                    visible={devOpen}
                    transparent
                    animationType="fade"
                    onRequestClose={closeDev}
                >
                    {/* backdrop */}
                    <Pressable onPress={closeDev} style={ui.devModalBackdrop} />

                    <View style={ui.devModalCard}>
                        <Text style={ui.devModalTitle}>Set Debug Date</Text>

                        <View style={{ height: 10 }} />

                        <DateTimePicker
                            value={pickerDate}
                            mode="date"
                            display={
                                Platform.OS === "ios" ? "inline" : "default"
                            }
                            onChange={(event, selectedDate) => {
                                if (!selectedDate) return;
                                setPickerDate(selectedDate);
                            }}
                        />

                        <View style={{ height: 12 }} />

                        <View style={ui.devModalBtnRow}>
                            <Pressable
                                onPress={resetDev}
                                style={[ui.devModalBtn, ui.devModalBtnGhost]}
                            >
                                <Text style={ui.devModalBtnText}>Reset</Text>
                            </Pressable>

                            <Pressable
                                onPress={saveDev}
                                style={[ui.devModalBtn, ui.devModalBtnPrimary]}
                            >
                                <Text style={ui.devModalBtnText}>
                                    Use this date
                                </Text>
                            </Pressable>
                        </View>

                        <Text style={ui.devModalHelper}>
                            {devOverrideIso
                                ? `Current override: ${devOverrideIso}`
                                : "No override set (using real today)"}
                        </Text>
                    </View>
                </Modal>
            ) : null}
        </SafeAreaView>
    );
}
