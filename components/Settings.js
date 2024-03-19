import { useState } from "react";
import { useFonts } from "expo-font";
import { StyleSheet, Text, SafeAreaView, View, Switch } from "react-native";
import { RadioButton } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import { setDateDisplay } from "../store/actions";

export default function Settings() {
    const [fontsLoaded] = useFonts({
        Nayuki: require("../assets/fonts/NayukiRegular.otf"),
    });
    const [holidayNotifications, setHolidayNotifications] = useState(false);
    const [shabbatNotifications, setShabbatNotifications] = useState(false);
    const [displayMode, setDisplayMode] = useState(false);
    const dateDisplay = useSelector((state) => state.dateDisplay);

    const dispatch = useDispatch();

    const toggleDisplayMode = () => {
        dispatch(setDisplayMode(!displayMode));
    };

    const handleDateDisplayChange = (newValue) => {
        dispatch(setDateDisplay(newValue));
    };

    const toggleHolidayNotifications = () => {
        setHolidayNotifications(!holidayNotifications);
    };

    const toggleShabbatNotifications = () => {
        setShabbatNotifications(!shabbatNotifications);
    };

    return (
        <SafeAreaView style={styles.container}>
            {fontsLoaded ? (
                <View style={styles.frame}>
                    <Text style={styles.headerText}>Shabbat Options</Text>
                    <View style={styles.optionContainer}>
                        <View>
                            <Text style={styles.smallText}>
                                Custom candle lighting time
                            </Text>
                        </View>
                        <Switch
                            trackColor={{ false: "#767577", true: "#82CBFF" }}
                            thumbColor={
                                holidayNotifications ? "white" : "#f4f3f4"
                            }
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleHolidayNotifications}
                            value={holidayNotifications}
                        />
                    </View>
                    <View style={styles.optionContainer}>
                        <View>
                            <Text style={styles.smallText}>
                                Custom havdalah time
                            </Text>
                        </View>
                        <Switch
                            trackColor={{ false: "#767577", true: "#82CBFF" }}
                            thumbColor={
                                holidayNotifications ? "white" : "#f4f3f4"
                            }
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleHolidayNotifications}
                            value={holidayNotifications}
                        />
                    </View>
                    <Text style={styles.headerText}>Holiday Options</Text>
                    <View style={styles.optionContainer}>
                        <View>
                            <Text style={styles.smallText}>
                                Include minor fasts
                            </Text>
                        </View>
                        <Switch
                            trackColor={{ false: "#767577", true: "#82CBFF" }}
                            thumbColor={
                                holidayNotifications ? "white" : "#f4f3f4"
                            }
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleHolidayNotifications}
                            value={holidayNotifications}
                        />
                    </View>
                    <View style={styles.optionContainer}>
                        <View>
                            <Text style={styles.smallText}>
                                Include roshei chodesh
                            </Text>
                        </View>
                        <Switch
                            trackColor={{ false: "#767577", true: "#82CBFF" }}
                            thumbColor={
                                holidayNotifications ? "white" : "#f4f3f4"
                            }
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleHolidayNotifications}
                            value={holidayNotifications}
                        />
                    </View>
                    <Text style={styles.radioHeaderText}>Date Format</Text>
                    <View style={styles.radioContainer}>
                        <RadioButton
                            color="#82CBFF"
                            value="gregorian"
                            status={
                                dateDisplay === "gregorian"
                                    ? "checked"
                                    : "unchecked"
                            }
                            onPress={() => handleDateDisplayChange("gregorian")}
                        />
                        <Text style={styles.radioText}>Gregorian</Text>
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
                            onPress={() => handleDateDisplayChange("hebrew")}
                        />
                        <Text style={styles.radioText}>Hebrew</Text>
                    </View>
                </View>
            ) : null}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
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
    frame: {
        padding: 20,
    },
    headerText: {
        color: "#82CBFF",
        fontSize: 30,
        marginBottom: 22,
    },
    smallText: {
        color: "white",
        fontSize: 20,
        marginBottom: 22,
    },
    tinyText: {
        color: "#82CBFF",
        fontSize: 16,
        marginBottom: 28,
    },
    radioHeaderText: {
        color: "#82CBFF",
        fontSize: 30,
        marginBottom: 16,
    },
    radioText: {
        color: "white",
        fontSize: 20,
        marginLeft: 6,
        marginTop: 6,
        marginBottom: 22,
    },
    lastRadioText: {
        color: "white",
        fontSize: 20,
        marginLeft: 6,
        marginBottom: 22,
    },
});
