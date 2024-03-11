import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, SafeAreaView, View } from "react-native";
import { useFonts } from "expo-font";

export default function App() {
    const [holidays, setHolidays] = useState([]);

    const fetchHolidays = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/holidays/");
            if (!response.ok) {
                throw new Error("Something went wrong fetching holiday info!");
            }
            const data = await response.json();
            console.log(data);
            setHolidays(data);
        } catch (error) {
            console.error("Something went wrong fetching holiday info!", error);
        }
    };

    useEffect(() => {
        fetchHolidays();
    }, []);

    const [fontsLoaded] = useFonts({
        Nayuki: require("./assets/fonts/NayukiRegular.otf"),
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <SafeAreaView style={styles.container}>
            {holidays?.holiday_info?.next ? (
                <View>
                    <Text style={styles.headerText}>Today is</Text>
                    <Text style={styles.bigBoldText}>{holidays.holiday_info.next.title}</Text>
                    <Text style={styles.hebrewText}>{holidays.holiday_info.next.hebrew}</Text>
                    <Text style={styles.dateText}>{holidays.holiday_info.next.date}</Text>
                    <Text style={styles.paragraphText}>{holidays.holiday_info.next.memo}</Text>
                </View>
            ) : (
                <Text>Today is not a Jewish holiday</Text>
                )}
            <StatusBar style="auto" />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "flex-start",
        justifyContent: "flex-start",
        backgroundColor: "black",
    },
    headerText: {
        color: "#82CBFF",
        fontSize: 32,
    },
    bigBoldText: {
        color: "white",
        fontFamily: "Nayuki",
        fontSize: 92,
    },
    hebrewText: {
        color: "#82CBFF",
        fontSize: 44,
    },
    dateText: {
        color: "#82CBFF",
        fontSize: 26,
    },
    paragraphText: {
        color: "white",
        fontSize: 32,
    },
});
