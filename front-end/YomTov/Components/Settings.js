import { useState } from "react";
import { useFonts } from "expo-font";
import { StyleSheet, Text, SafeAreaView, View, Switch } from "react-native";
import { RadioButton } from "react-native-paper";

export default function Settings() {
    const [fontsLoaded] = useFonts({
        Nayuki: require("../assets/fonts/NayukiRegular.otf"),
    });
    const [holidayNotifications, setHolidayNotifications] = useState(false);
    const [shabbatNotifications, setShabbatNotifications] = useState(false);
    const [dateDisplay, setDateDisplay] = useState("gregorian");

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
                    <Text style={styles.headerText}>Settings</Text>
                    <View style={styles.optionContainer}>
                        <Text style={styles.smallText}>
                            Holiday push notification
                        </Text>
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
                        <Text style={styles.smallText}>
                            Shabbat push notification
                        </Text>
                        <Switch
                            trackColor={{ false: "#767577", true: "#82CBFF" }}
                            thumbColor={
                                shabbatNotifications ? "white" : "#f4f3f4"
                            }
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleShabbatNotifications}
                            value={shabbatNotifications}
                        />
                    </View>
                    <Text style={styles.smallText}>Date format</Text>
                    <View style={styles.radioContainer}>
                        <RadioButton
                            color="#82CBFF"
                            value="gregorian"
                            status={
                                dateDisplay === "gregorian"
                                    ? "checked"
                                    : "unchecked"
                            }
                            onPress={() => setDateDisplay("gregorian")}
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
                            onPress={() => setDateDisplay("hebrew")}
                        />
                        <Text style={styles.radioText}>Hebrew</Text>
                    </View>
                    <Text style={styles.headerText}>About</Text>
                    <Text style={styles.smallText}>
                        YomTov is a simple app that provides information about
                        Jewish holidays and Shabbat times. It is designed to be
                        intuitive and accessible.
                    </Text>
                    <Text style={styles.smallText}>
                        YomTov was coded by Daniel Brainich and designed by
                        Andrea Portillo. It was inspired by
                        istodayajewishholiday.com and is powered by the
                        hebcal.com API.
                    </Text>
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
        marginBottom: 28,
    },
    radioText: {
        color: "white",
        fontSize: 20,
        marginLeft: 6,
        marginTop: 6,
        marginBottom: 20,
    },
});
