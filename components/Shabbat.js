import { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    RefreshControl,
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

export default function Shabbat() {
    const [fontsLoaded] = useFonts({
        Nayuki: require("../assets/fonts/NayukiRegular.otf"),
    });
    const [location, setLocation] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [shabbatInfo, setShabbatInfo] = useState({});
    const dateDisplay = useSelector((state) => state.dateDisplay);
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const today = new Date().toISOString().split("T")[0];
    // const today = "2024-12-29";

    useEffect(() => {
        (async () => {
            let { status } =
                await ExpoLocation.requestForegroundPermissionsAsync();
            if (status === "granted") {
                const location = await ExpoLocation.getCurrentPositionAsync({});
                setLocation({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    elevation: location.coords.altitude,
                });
            } else {
                console.log("Permission to access location was denied");
                fetchShabbatInfo();
            }
        })();
    }, [refreshing]);

    useEffect(() => {
        fetchShabbatInfo();
    }, [location, refreshing]);

    const fetchShabbatInfo = async () => {
        try {
            const friday = new Date(today);
            friday.setDate(friday.getDate() + (5 - friday.getDay()));
            const saturday = new Date(friday);
            saturday.setDate(friday.getDate() + 1);

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
                    sedrot: true,
                });
            } else {
                events = HebrewCalendar.calendar({
                    start: friday,
                    end: saturday,
                    sedrot: true,
                });
            }
            const newShabbatInfo = getShabbatInfo(events);

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

    function formatTime(date) {
        return timeFormatter
            .formatToParts(date)
            .map(({ type, value }) => {
                if (type === "dayPeriod") {
                    return value.toLowerCase();
                }
                return value;
            })
            .join("");
    }

    function getShabbatInfo(events) {
        const shabbatInfo = {
            candleDesc: null,
            candleTime: null,
            sundown: null,
            candleDate: null,
            candleHDate: null,

            parshaHebrew: null,
            parshaEnglish: null,
            parshaHDate: null,

            havdalahDesc: null,
            havdalahTime: null,
            havdalahDate: null,
            havdalahHDate: null,

            erevShabbatDate: null,
            yomShabbatDate: null,
        };

        for (const event of events) {
            if (event instanceof CandleLightingEvent) {
                shabbatInfo.candleDesc = event.renderBrief("he-x-NoNikud");
                shabbatInfo.candleTime = event.fmtTime || null;
                shabbatInfo.candleDate = event.eventTime
                    ? dateFormatter.format(new Date(event.eventTime))
                    : null;
                shabbatInfo.candleHDate = event.date
                    ? event.date.toString()
                    : null;

                const candleDateTime = new Date(event.eventTime);
                candleDateTime.setMinutes(candleDateTime.getMinutes() + 18);
                shabbatInfo.sundown = formatTime(candleDateTime);
            } else if (event instanceof ParshaEvent) {
                shabbatInfo.parshaEnglish = event.render("en");
                shabbatInfo.parshaHebrew = event.renderBrief("he-x-NoNikud");
                shabbatInfo.parshaHDate = event.date
                    ? event.date.toString()
                    : null;
            } else if (event instanceof HavdalahEvent) {
                shabbatInfo.havdalahDesc = event.renderBrief("he-x-NoNikud");
                shabbatInfo.havdalahTime = event.fmtTime || null;
                shabbatInfo.havdalahDate = event.eventTime
                    ? dateFormatter.format(new Date(event.eventTime))
                    : null;
                shabbatInfo.havdalahHDate = event.date
                    ? event.date.toString()
                    : null;
            }
        }
        return shabbatInfo;
    }

    const handleRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
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

                                {shabbatInfo.sundown && (
                                    <View style={styles.list}>
                                        <Text style={styles.paragraphText}>
                                            Sundown
                                        </Text>
                                        <Text style={styles.paragraphText}>
                                            {shabbatInfo.sundown}
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

                                <View style={styles.spacer} />

                                <Text style={styles.mediumBoldText}>
                                    Parasha
                                </Text>
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
                        ) :
                            <Text style={styles.blueFooterText}>
                                For candle lighting and havdalah times, please enable location services.
                            </Text>
                        }
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
        justifyContent: "start",
        alignItems: "start",
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
