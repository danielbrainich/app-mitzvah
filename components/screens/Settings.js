import { useFonts } from "expo-font";
import {
    StyleSheet,
    Text,
    SafeAreaView,
    View,
    Switch,
    ScrollView,
} from "react-native";
import Stepper from "../Stepper";
import { RadioButton } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import React, { useState, useEffect } from "react";
import {
    setDateDisplay,
    toggleMinorFasts,
    toggleRosheiChodesh,
    toggleModernHolidays,
    setCandleLightingTime,
    setHavdalahTime,
    setCandleLightingToggle,
    setHavdalahTimeToggle,
} from "../../store/actions";
import InfoFooter from "../InfoFooter";
export default function Settings() {
    const [fontsLoaded] = useFonts({
        Nayuki: require("../../assets/fonts/NayukiRegular.otf"),
    });

    const {
        dateDisplay,
        minorFasts,
        rosheiChodesh,
        modernHolidays,
        candleLightingTime,
        havdalahTime,
        candleLightingToggle,
        havdalahTimeToggle,
    } = useSelector((state) => state.settings);

    const [candleTimeInput, setCandleTimeInput] = useState(
        candleLightingTime?.toString() || "1"
    );
    const [havdalahTimeInput, setHavdalahTimeInput] = useState(
        havdalahTime?.toString() || "1"
    );

    useEffect(() => {
        setCandleTimeInput(candleLightingTime?.toString() || "1");
        setHavdalahTimeInput(havdalahTime?.toString() || "1");
    }, [candleLightingTime, havdalahTime]);

    const dispatch = useDispatch();

    const handleDateDisplayChange = (newValue) => {
        dispatch(setDateDisplay(newValue));
    };

    const handleToggleMinorFasts = () => {
        dispatch(toggleMinorFasts());
    };

    const handleToggleRosheiChodesh = () => {
        dispatch(toggleRosheiChodesh());
    };

    const handleToggleModernHolidays = () => {
        dispatch(toggleModernHolidays());
    };

    const incrementCandleTime = () => {
        const currentValue = parseInt(candleTimeInput, 10);
        const newValue = currentValue >= 60 ? 60 : currentValue + 1;
        setCandleTimeInput(newValue.toString());
        dispatch(setCandleLightingTime(newValue));
    };

    const decrementCandleTime = () => {
        const currentValue = parseInt(candleTimeInput, 10);
        const newValue = currentValue <= 1 ? 1 : currentValue - 1;
        setCandleTimeInput(newValue.toString());
        dispatch(setCandleLightingTime(newValue));
    };

    const incrementHavdalahTime = () => {
        const currentValue = parseInt(havdalahTimeInput, 10);
        const newValue = currentValue >= 60 ? 60 : currentValue + 1;
        setHavdalahTimeInput(newValue.toString());
        dispatch(setHavdalahTime(newValue));
    };

    const decrementHavdalahTime = () => {
        const currentValue = parseInt(havdalahTimeInput, 10);
        const newValue = currentValue <= 1 ? 1 : currentValue - 1;
        setHavdalahTimeInput(newValue.toString());
        dispatch(setHavdalahTime(newValue));
    };

    const handleCandleLightingToggle = () => {
        const newToggleState = !candleLightingToggle;
        dispatch(setCandleLightingToggle(newToggleState));
        if (newToggleState) {
            const newValue = candleTimeInput !== null ? candleTimeInput : "1";
            setCandleTimeInput(newValue);
            dispatch(setCandleLightingTime(parseInt(newValue, 10)));
        } else {
            setCandleTimeInput(null);
            dispatch(setCandleLightingTime(null));
        }
    };

    const handleHavdalahTimeToggle = () => {
        const newToggleState = !havdalahTimeToggle;
        dispatch(setHavdalahTimeToggle(newToggleState));
        if (newToggleState) {
            const newValue =
                havdalahTimeInput !== null ? havdalahTimeInput : "1";
            setHavdalahTimeInput(newValue);
            dispatch(setHavdalahTime(parseInt(newValue, 10)));
        } else {
            setHavdalahTimeInput(null);
            dispatch(setHavdalahTime(null));
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                {fontsLoaded ? (
                    <View style={styles.frame}>
                        <Text style={styles.headerText}>Date Format</Text>
                        <View style={styles.radioContainer}>
                            <RadioButton
                                color="#82CBFF"
                                value="gregorian"
                                status={
                                    dateDisplay === "gregorian"
                                        ? "checked"
                                        : "unchecked"
                                }
                                onPress={() =>
                                    handleDateDisplayChange("gregorian")
                                }
                            />
                            <Text style={styles.smallText}>Gregorian</Text>
                        </View>
                        <View style={styles.radioContainer}>
                            <RadioButton
                                color="#82CBFF"
                                value="hebrew"
                                status={
                                    dateDisplay === "hebrew"
                                        ? "checked"
                                        : "unchecked"
                                }
                                onPress={() =>
                                    handleDateDisplayChange("hebrew")
                                }
                            />
                            <Text style={styles.smallText}>Hebrew</Text>
                        </View>
                        <Text style={styles.headerText}>Holiday Options</Text>
                        <View style={styles.optionContainer}>
                            <View>
                                <Text style={styles.smallText}>
                                    Include modern holidays
                                </Text>
                            </View>
                            <Switch
                                trackColor={{
                                    false: "#767577",
                                    true: "#82CBFF",
                                }}
                                thumbColor={minorFasts ? "white" : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={handleToggleModernHolidays}
                                value={modernHolidays}
                            />
                        </View>
                        <View style={styles.optionContainer}>
                            <View>
                                <Text style={styles.smallText}>
                                    Include minor fasts
                                </Text>
                            </View>
                            <Switch
                                trackColor={{
                                    false: "#767577",
                                    true: "#82CBFF",
                                }}
                                thumbColor={minorFasts ? "white" : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={handleToggleMinorFasts}
                                value={minorFasts}
                            />
                        </View>
                        <View style={styles.optionContainer}>
                            <View>
                                <Text style={styles.smallText}>
                                    Include roshei chodesh
                                </Text>
                            </View>
                            <Switch
                                trackColor={{
                                    false: "#767577",
                                    true: "#82CBFF",
                                }}
                                thumbColor={rosheiChodesh ? "white" : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={handleToggleRosheiChodesh}
                                value={rosheiChodesh}
                            />
                        </View>
                        <Text style={styles.headerText}>Shabbat Options</Text>
                        <View style={styles.optionContainer}>
                            <Text style={styles.smallTopText}>
                                Custom candle lighting time
                            </Text>

                            <Switch
                                trackColor={{
                                    false: "#767577",
                                    true: "#82CBFF",
                                }}
                                thumbColor={
                                    candleLightingToggle ? "#f4f3f4" : "#f4f3f4"
                                }
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={handleCandleLightingToggle}
                                value={candleLightingToggle}
                            />
                        </View>
                        {candleLightingToggle ? (
                            <>
                                <View style={styles.flexBox}>
                                    <Stepper
                                        value={candleTimeInput.toString()}
                                        onIncrement={incrementCandleTime}
                                        onDecrement={decrementCandleTime}
                                        message="min. before sundown"
                                    />
                                </View>
                            </>
                        ) : (
                            <Text
                                style={[
                                    styles.settingsSubText,
                                    styles.rightMargin,
                                ]}
                            >
                                Default is 18 minutes before sundown
                            </Text>
                        )}
                        <View style={styles.optionContainer}>
                            <Text style={styles.smallTopText}>
                                Custom Havdalah time
                            </Text>
                            <Switch
                                trackColor={{
                                    false: "#767577",
                                    true: "#82CBFF",
                                }}
                                thumbColor={
                                    havdalahTimeToggle ? "#f4f3f4" : "#f4f3f4"
                                }
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={handleHavdalahTimeToggle}
                                value={havdalahTimeToggle}
                            />
                        </View>
                        {havdalahTimeToggle ? (
                            <>
                                <View style={styles.flexBox}>
                                    <Stepper
                                        value={havdalahTimeInput.toString()}
                                        onIncrement={incrementHavdalahTime}
                                        onDecrement={decrementHavdalahTime}
                                        message="min. after sundown"
                                    />
                                </View>
                            </>
                        ) : (
                            <Text
                                style={[
                                    styles.settingsSubText,
                                    styles.rightMargin,
                                ]}
                            >
                                Default is 42 minutes after sundown
                            </Text>
                        )}
                        <InfoFooter />
                    </View>
                ) : null}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
        alignItems: "flex-start",
        justifyContent: "flex-start",
    },
    topOptionContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    optionContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    radioContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "flex-center",
    },
    rightMargin: {
        marginRight: 45,
    },
    frame: {
        padding: 20,
    },
    headerText: {
        color: "#82CBFF",
        fontSize: 22,
        marginBottom: 12,
    },
    smallText: {
        color: "white",
        fontSize: 18,
        marginBottom: 18,
    },
    smallTopText: {
        color: "white",
        fontSize: 20,
        marginBottom: 12,
    },
    settingsSubText: {
        color: "rgba(255,255,255,0.72)",
        fontSize: 14,
        marginBottom: 22,
    },

    flexBox: {
        flexDirection: "row",
        justifyContent: "start",
        alignItems: "center",
    },
});
