import { useState, useEffect, useRef } from "react";

import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    RefreshControl,
    Linking,
    TouchableOpacity,
    AppState,
} from "react-native";
import {
    HebrewCalendar,
    Location,
    CandleLightingEvent,
    ParshaEvent,
    HavdalahEvent,
    HDate,
} from "@hebcal/core";
import { useFonts } from "expo-font";
import * as ExpoLocation from "expo-location";
import { useSelector } from "react-redux";



function formatTime(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    const amPm = hours >= 12 ? 'pm' : 'am';
    const formattedHour = hours % 12 === 0 ? 12 : hours % 12;
    return `${formattedHour}:${minutes} ${amPm}`;
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("en-GB", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
});

const calculateTimeUntilMidnight = () => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setDate(now.getDate() + 1);
    midnight.setHours(0, 0, 0, 0);
    return midnight.getTime() - now.getTime();
};

function getShabbatInfo(events, candleLightingTime) {
    const shabbatInfo = {};
    console.log(events);
    for (const event of events) {
        if (event instanceof CandleLightingEvent) {
            shabbatInfo.candleDesc = event.renderBrief("he-x-NoNikud");
            shabbatInfo.candleHDate = event.date ? event.date.toString() : null;

            const sundownTime = new Date(event.eventTime);
            sundownTime.setMinutes(sundownTime.getMinutes() + 1);
            shabbatInfo.sundownFriday = formatTime(sundownTime);

            const adjustmentTime =
                candleLightingTime !== null && candleLightingTime !== undefined
                    ? candleLightingTime
                    : 18;
            const candleDateTime = new Date(sundownTime);
            candleDateTime.setMinutes(
                candleDateTime.getMinutes() - adjustmentTime
            );
            shabbatInfo.candleTime = formatTime(candleDateTime);
        } else if (event instanceof ParshaEvent) {
            shabbatInfo.parshaEnglish = event.render("en");
            shabbatInfo.parshaHebrew = event.renderBrief("he-x-NoNikud");
            shabbatInfo.parshaHDate = event.date ? event.date.toString() : null;
        } else if (event instanceof HavdalahEvent) {
            shabbatInfo.havdalahDesc = event.renderBrief("he-x-NoNikud");
            shabbatInfo.havdalahTime = event.fmtTime || null;
        }
    }
    console.log(shabbatInfo);
    return shabbatInfo;
}

export default function Shabbat() {
    const [fontsLoaded] = useFonts({
        Nayuki: require("../assets/fonts/NayukiRegular.otf"),
    });
    const [location, setLocation] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [shabbatInfo, setShabbatInfo] = useState({});
    const { dateDisplay, candleLightingTime, havdalahTime } = useSelector(
        (state) => state.settings
    );
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const [appState, setAppState] = useState(AppState.currentState);
    const today = new Date().toISOString().split("T")[0];
    // const today = "2024-12-29";
    const timeoutIdRef = useRef(null);
    const intervalIdRef = useRef(null);

    const checkPermissionsAndFetchLocation = async () => {
        try {
            let { status } =
                await ExpoLocation.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                console.log("Location permission not granted");
                return;
            }

            const location = await ExpoLocation.getCurrentPositionAsync({});
            setLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                elevation: location.coords.altitude,
            });
        } catch (error) {
            console.error("Error fetching location:", error);
        }
    };

    useEffect(() => {
        checkPermissionsAndFetchLocation();

        const handleAppStateChange = (nextAppState) => {
            if (
                appState.match(/inactive|background/) &&
                nextAppState === "active"
            ) {
                checkPermissionsAndFetchLocation();
            }
            setAppState(nextAppState);
        };

        const subscription = AppState.addEventListener(
            "change",
            handleAppStateChange
        );
        return () => subscription.remove();
    }, [appState]);

    useEffect(() => {
        fetchShabbatInfo();
    }, [location, havdalahTime, candleLightingTime]);

    useEffect(() => {
        const setupDailyRefresh = () => {
            const timeoutDuration = calculateTimeUntilMidnight();

            if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
            timeoutIdRef.current = setTimeout(() => {
                fetchShabbatInfo();
                if (intervalIdRef.current) clearInterval(intervalIdRef.current);
                intervalIdRef.current = setInterval(() => {
                    fetchShabbatInfo();
                }, 86400000);
            }, timeoutDuration);
        };

        setupDailyRefresh();

        return () => {
            if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
            if (intervalIdRef.current) clearInterval(intervalIdRef.current);
        };
    }, []);

    const fetchShabbatInfo = async () => {
        try {
            const today = new Date();
            const friday = new Date(today);
            const saturday = new Date(today);

            if (today.getDay() === 6) {
                friday.setDate(today.getDate() - 1);
            } else {
                friday.setDate(friday.getDate() + (5 - friday.getDay()));
                saturday.setDate(friday.getDate() + 1);
            }

            const erevShabbatDate = dateFormatter.format(friday);
            const yomShabbatDate = dateFormatter.format(saturday);

            const erevShabbatHebrewDate = new HDate(friday).toString();
            const yomShabbatHebrewDate = new HDate(saturday).toString();

            let events;
            if (location) {
                const hebcalLocation = new Location(
                    location.latitude,
                    location.longitude,
                    false,
                    timezone,
                    undefined,
                    "US",
                    undefined,
                    location.elevation
                );

                events = HebrewCalendar.calendar({
                    start: friday,
                    end: saturday,
                    location: hebcalLocation,
                    candlelighting: true,
                    havdalahMins: havdalahTime,
                    candleLightingMins: 1,
                    sedrot: true,
                });
            } else {
                events = HebrewCalendar.calendar({
                    start: friday,
                    end: saturday,
                    sedrot: true,
                });
            }

            const newShabbatInfo = getShabbatInfo(events, candleLightingTime);

            // Additional fetch for sundown time on Saturday
            if (location) {
                const dummyEvents = HebrewCalendar.calendar({
                    start: saturday,
                    end: saturday,
                    location: new Location(
                        location.latitude,
                        location.longitude,
                        false,
                        timezone,
                        undefined,
                        "US",
                        undefined,
                        location.elevation
                    ),
                    candlelighting: true,
                    havdalahMins: 1,
                });

                const dummyHavdalahEvent = dummyEvents.find(
                    (event) => event instanceof HavdalahEvent
                );
                if (dummyHavdalahEvent) {
                    const sundownTime = new Date(dummyHavdalahEvent.eventTime);
                    sundownTime.setMinutes(sundownTime.getMinutes() - 1);
                    newShabbatInfo.sundownSaturday = formatTime(sundownTime);
                }
            }

            setShabbatInfo({
                ...newShabbatInfo,
                erevShabbatDate: erevShabbatDate,
                erevShabbatHebrewDate: erevShabbatHebrewDate,
                yomShabbatDate: yomShabbatDate,
                yomShabbatHebrewDate: yomShabbatHebrewDate,
            });
        } catch (error) {
            console.error("Error fetching Shabbat info:", error);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchShabbatInfo();
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    };

    const openSettings = () => {
        Linking.openSettings().catch(() => {
            Alert.alert("Unable to open settings");
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.scrollViewContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                    />
                }
            >
                {fontsLoaded ? (
                    <View style={styles.frame}>
                        {shabbatInfo ? (
                            <>
                                <Text style={styles.headerText}>This week</Text>
                                <Text style={styles.mediumBoldText}>
                                    Erev Shabbat
                                </Text>
                                <View style={styles.list}>
                                    <Text style={styles.paragraphText}>
                                        Date
                                    </Text>
                                    {shabbatInfo.erevShabbatDate &&
                                        shabbatInfo.erevShabbatHebrewDate && (
                                            <Text style={styles.paragraphText}>
                                                {dateDisplay === "gregorian"
                                                    ? shabbatInfo.erevShabbatDate
                                                    : shabbatInfo.erevShabbatHebrewDate}
                                            </Text>
                                        )}
                                </View>

                                {shabbatInfo.candleTime && (
                                    <View style={styles.list}>
                                        <Text style={styles.paragraphText}>
                                            Candle Lighting
                                        </Text>
                                        <Text style={styles.paragraphText}>
                                            {shabbatInfo.candleTime}
                                        </Text>
                                    </View>
                                )}

                                {shabbatInfo.sundownFriday && (
                                    <View style={styles.list}>
                                        <Text style={styles.paragraphText}>
                                            Sundown
                                        </Text>
                                        <Text style={styles.paragraphText}>
                                            {shabbatInfo.sundownFriday}
                                        </Text>
                                    </View>
                                )}

                                <View style={styles.spacer} />
                                <Text style={styles.mediumBoldText}>
                                    Yom Shabbat
                                </Text>

                                <View style={styles.list}>
                                    <Text style={styles.paragraphText}>
                                        Date
                                    </Text>
                                    {shabbatInfo.yomShabbatDate &&
                                        shabbatInfo.yomShabbatHebrewDate && (
                                            <Text style={styles.paragraphText}>
                                                {dateDisplay === "gregorian"
                                                    ? shabbatInfo.yomShabbatDate
                                                    : shabbatInfo.yomShabbatHebrewDate}
                                            </Text>
                                        )}
                                </View>

                                {shabbatInfo.havdalahTime && (
                                    <View style={styles.list}>
                                        <Text style={styles.paragraphText}>
                                            Havdalah
                                        </Text>
                                        <Text style={styles.paragraphText}>
                                            {shabbatInfo.havdalahTime}
                                        </Text>
                                    </View>
                                )}

                                {shabbatInfo.sundownSaturday && (
                                    <View style={styles.list}>
                                        <Text style={styles.paragraphText}>
                                            Sundown
                                        </Text>
                                        <Text style={styles.paragraphText}>
                                            {shabbatInfo.sundownSaturday}
                                        </Text>
                                    </View>
                                )}
                                <View style={styles.spacer} />
                                {shabbatInfo.parshaEnglish && (
                                    <Text style={styles.mediumBoldText}>
                                        Parasha
                                    </Text>
                                )}
                                <View style={styles.list}>
                                    {shabbatInfo.parshaEnglish && (
                                        <Text style={styles.paragraphText}>
                                            {shabbatInfo.parshaEnglish}
                                        </Text>
                                    )}
                                    {shabbatInfo.parshaHebrew && (
                                        <Text style={styles.paragraphText}>
                                            {shabbatInfo.parshaHebrew}
                                        </Text>
                                    )}
                                </View>
                            </>
                        ) : (
                            <Text style={styles.paragraphText}>
                                Loading Shabbat info...
                            </Text>
                        )}
                        <View style={styles.spacer} />
                        <View style={styles.spacer} />
                        <View style={styles.spacer} />
                        {location ? (
                            <>
                                <View style={styles.footerList}>
                                    <Text style={styles.footerText}>
                                        Elevation {""}
                                    </Text>
                                    <Text style={styles.footerSubText}>
                                        {location.elevation.toFixed(1)} meters
                                    </Text>
                                </View>
                                <View style={styles.footerList}>
                                    <Text style={styles.footerText}>
                                        Coordinates {""}
                                    </Text>
                                    <Text style={styles.footerSubText}>
                                        {location.latitude.toFixed(3)},{" "}
                                        {location.longitude.toFixed(3)}
                                    </Text>
                                </View>
                                <View style={styles.footerList}>
                                    <Text style={styles.footerWhiteSubText}>
                                        Timezone {""}
                                    </Text>
                                    <Text style={styles.footerSubText}>
                                        {timezone.replace(/_/g, " ")}
                                    </Text>
                                </View>
                            </>
                        ) : (
                            <View style={styles.footerList}>
                                <Text style={styles.footerText}>
                                    For candle lighting and havdalah times,
                                    please
                                </Text>
                                <TouchableOpacity
                                    onPress={() => Linking.openSettings()}
                                >
                                    <Text style={styles.blueFooterText}>
                                        enable location services.
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                ) : null}
            </ScrollView>
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
    scrollViewContent: {
        flex: 1,
        alignSelf: "stretch",
    },
    frame: {
        padding: 20,
        paddingTop: 40,
    },
    spacer: {
        marginBottom: 18,
    },
    mediumBoldText: {
        color: "#82CBFF",
        fontFamily: "Nayuki",
        fontSize: 42,
        marginBottom: 16,
    },
    list: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    footerList: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        flexWrap: "wrap",
    },
    paragraphText: {
        color: "white",
        fontSize: 20,
        marginBottom: 8,
    },
    footerText: {
        color: "white",
        fontSize: 16,
    },
    blueFooterText: {
        color: "#82CBFF",
        fontSize: 16,
    },
    footerSubText: {
        color: "#82CBFF",
        fontSize: 16,
    },
    footerWhiteSubText: {
        color: "white",
        fontSize: 16,
    },
    headerText: {
        color: "white",
        fontSize: 30,
        marginBottom: 36,
    },
});
