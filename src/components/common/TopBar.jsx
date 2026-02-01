import React, { useMemo, useState, useCallback, useEffect } from "react";
import { View, Text, Pressable, Modal, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
    formatGregorianLongFromIso,
    formatHebrewLongFromIso,
} from "../../utils/datetime";
import { ui, colors } from "../../constants/theme";
import * as Haptics from "expo-haptics";
import { Entypo } from "@expo/vector-icons";

import {
    setDevOverrideIsoDate,
    getDevOverrideIsoDate,
    setDevOverrideTime,
    getDevOverrideTime,
} from "../../hooks/useTodayIsoDay";

// Local helpers
function parseIsoToDate(iso) {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d, 12, 0, 0, 0);
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
    const [pickerTime, setPickerTime] = useState(() => new Date());
    const [devOverrideIso, setDevOverrideIso] = useState(null);

    useEffect(() => {
        if (!__DEV__) return;
        getDevOverrideIsoDate()
            .then(setDevOverrideIso)
            .catch(() => {});
        getDevOverrideTime()
            .then((time) => {
                if (time) setPickerTime(new Date(time));
            })
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
        const currentTime = await getDevOverrideTime();
        setDevOverrideIso(current);

        const baseIso = current || todayIso;
        setPickerDate(parseIsoToDate(baseIso));

        if (currentTime) {
            setPickerTime(new Date(currentTime));
        }

        setDevOpen(true);
    }, [todayIso]);

    const closeDev = useCallback(() => setDevOpen(false), []);

    const saveDev = useCallback(async () => {
        const iso = dateToIsoLocal(pickerDate);
        await setDevOverrideIsoDate(iso);
        await setDevOverrideTime(pickerTime.getTime());
        setDevOverrideIso(iso);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setDevOpen(false);
    }, [pickerDate, pickerTime]);

    const resetDev = useCallback(async () => {
        await setDevOverrideIsoDate(null);
        await setDevOverrideTime(null);
        setDevOverrideIso(null);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setDevOpen(false);
    }, []);

    const showDevBadge = __DEV__ && !!devOverrideIso;

    return (
        <SafeAreaView edges={["top", "left", "right"]} style={ui.topBarSafe}>
            <View style={ui.topBarWrap}>
                {/* LEFT: Date pill */}
                <Pressable
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setShowHebrew((v) => !v);
                    }}
                    onLongPress={() => {
                        if (__DEV__) openDev();
                    }}
                    hitSlop={12}
                    style={ui.topBarDatePressable}
                >
                    <View style={ui.topBarDatePill}>
                        <Entypo name="cycle" size={14} color={colors.white} />
                        <Text style={ui.topBarDateText} numberOfLines={1}>
                            {label}
                        </Text>

                        {showDevBadge ? <View style={ui.topBarDevDot} /> : null}
                    </View>
                </Pressable>

                {/* RIGHT: Gear */}
                <Pressable
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        navigation.navigate("Settings");
                    }}
                    hitSlop={12}
                    style={[ui.iconButton, ui.topBarGearBtn]}
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
                    <Pressable onPress={closeDev} style={ui.devModalBackdrop} />

                    <View style={ui.devModalCard}>
                        <Text style={ui.devModalTitle}>
                            Set Debug Date & Time
                        </Text>

                        <View style={{ height: 10 }} />

                        <DateTimePicker
                            value={pickerDate}
                            mode="date"
                            display={
                                Platform.OS === "ios" ? "inline" : "default"
                            }
                            themeVariant="dark"
                            onChange={(event, selectedDate) => {
                                if (!selectedDate) return;
                                const localDate = new Date(
                                    selectedDate.getFullYear(),
                                    selectedDate.getMonth(),
                                    selectedDate.getDate(),
                                    pickerTime.getHours(),
                                    pickerTime.getMinutes(),
                                    0,
                                    0
                                );
                                setPickerDate(localDate);
                            }}
                        />

                        <View style={{ height: 10 }} />

                        <DateTimePicker
                            value={pickerTime}
                            mode="time"
                            display={
                                Platform.OS === "ios" ? "spinner" : "default"
                            }
                            themeVariant="dark"
                            onChange={(event, selectedTime) => {
                                if (!selectedTime) return;
                                setPickerTime(selectedTime);
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
                                    Use this date & time
                                </Text>
                            </Pressable>
                        </View>

                        <Text style={ui.devModalHelper}>
                            {devOverrideIso
                                ? `Current override: ${devOverrideIso} at ${pickerTime.toLocaleTimeString()}`
                                : "No override set (using real today)"}
                        </Text>
                    </View>
                </Modal>
            ) : null}
        </SafeAreaView>
    );
}
