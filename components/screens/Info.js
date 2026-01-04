// screens/Info.js
import React, { useMemo, useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Linking,
    Alert,
} from "react-native";
import { useFonts } from "expo-font";

// Tip tiers (IAP-friendly)
const TIP_TIERS = [1, 2, 5, 10, 18];

// TODO: replace
const SUPPORT_EMAIL = "support@example.com";

export default function Info() {
    const [fontsLoaded] = useFonts({
        Nayuki: require("../../assets/fonts/NayukiRegular.otf"),
    });

    const [amount, setAmount] = useState(10); // default tier

    const handleOpenUrl = async (url) => {
        try {
            const supported = await Linking.canOpenURL(url);
            if (!supported) return Alert.alert("Can’t open link", url);
            await Linking.openURL(url);
        } catch {
            Alert.alert("Error", "Could not open the link.");
        }
    };

    // Placeholder until you wire IAP:
    const handleTip = () => {
        Alert.alert(
            "Tip (In-App Purchase)",
            `Selected: $${amount}\n\nNext step: create IAP products (tip_1, tip_2, tip_5, tip_10, tip_18) and call purchase().`
        );
    };

    const SECTIONS = useMemo(
        () => [
            {
                title: "About",
                body: [
                    "This app displays Jewish calendar information and daily zmanim based on your location and local timezone.",
                    "It includes Shabbat and holiday times such as candle lighting and havdalah, along with other calendar details depending on your settings.",
                ],
            },
            {
                title: "How times are calculated",
                body: [
                    "Zmanim and calendar data are computed using the Hebcal calculation engine.",
                    "Results depend on your device location, timezone, and the calculation settings you choose.",
                ],
            },
            {
                title: "Accuracy & important note",
                body: [
                    "Candle lighting and havdalah times can vary by community custom and halachic opinion.",
                    "Please confirm times and practices with your local community/rabbi—especially for holidays and edge cases (travel, altitude, unusual latitudes, DST transitions, etc.).",
                    "This app is an informational tool and is not a substitute for halachic guidance.",
                ],
            },
            {
                title: "Location & privacy",
                body: [
                    "Your location is used to calculate local times (zmanim, candle lighting, havdalah).",
                    "This app does not require an account.",
                    "If you deny location permission, the app may be unable to calculate accurate local times.",
                ],
            },
            {
                title: "Credits",
                body: [
                    "Calendar & zmanim calculations: Hebcal (via @hebcal/core).",
                    "Thank you to the open-source community for making these tools available.",
                ],
            },
        ],
        []
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.screen}>
                {!fontsLoaded ? null : (
                    <>
                        <Text style={styles.pageHeader}>Info</Text>

                        {SECTIONS.map((section) => (
                            <View key={section.title} style={styles.card}>
                                <Text style={styles.cardTitle}>
                                    {section.title}
                                </Text>
                                {section.body.map((p, idx) => (
                                    <Text
                                        key={`${section.title}-${idx}`}
                                        style={styles.paragraph}
                                    >
                                        {p}
                                    </Text>
                                ))}
                            </View>
                        ))}

                        {/* Contact */}
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Contact</Text>
                            <Text style={styles.paragraph}>
                                For bugs, feedback, or questions:
                            </Text>
                            <TouchableOpacity
                                onPress={() =>
                                    handleOpenUrl(`mailto:${SUPPORT_EMAIL}`)
                                }
                                activeOpacity={0.8}
                            >
                                <Text style={styles.link}>{SUPPORT_EMAIL}</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Support */}
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Support</Text>
                            <Text style={styles.paragraph}>
                                If you find this helpful, you can leave an
                                optional tip (via In-App Purchase).
                            </Text>

                            <View style={styles.tipHeader}>
                                <Text style={styles.tipLabel}>Tip amount</Text>
                                <Text style={styles.tipAmount}>${amount}</Text>
                            </View>

                            <View style={styles.tiersRow}>
                                {TIP_TIERS.map((v) => {
                                    const selected = v === amount;
                                    return (
                                        <TouchableOpacity
                                            key={v}
                                            onPress={() => setAmount(v)}
                                            activeOpacity={0.85}
                                            style={[
                                                styles.tierPill,
                                                selected
                                                    ? styles.tierPillSelected
                                                    : null,
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.tierText,
                                                    selected
                                                        ? styles.tierTextSelected
                                                        : null,
                                                ]}
                                            >
                                                ${v}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>

                            <TouchableOpacity
                                style={styles.primaryButton}
                                onPress={handleTip}
                                activeOpacity={0.85}
                            >
                                <Text style={styles.primaryButtonText}>
                                    Tip ${amount}
                                </Text>
                            </TouchableOpacity>

                            <Text style={styles.finePrint}>
                                Tips are optional and do not affect app
                                functionality.
                            </Text>
                        </View>

                        <View style={{ height: 28 }} />
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
    },

    screen: {
        paddingHorizontal: 20,
        paddingTop: 66,
        paddingBottom: 24,
    },

    pageHeader: {
        color: "white",
        fontSize: 30,
        marginBottom: 12,
        // matches your app vibe (Nayuki used elsewhere)
        fontFamily: "Nayuki",
    },

    card: {
        backgroundColor: "#202020",
        borderRadius: 18,
        padding: 18,
        marginBottom: 18,
    },

    cardTitle: {
        color: "#82CBFF",
        fontFamily: "Nayuki",
        fontSize: 32,
        marginBottom: 10,
    },

    paragraph: {
        color: "rgba(255,255,255,0.88)",
        fontSize: 16,
        lineHeight: 22,
        marginBottom: 10,
    },

    link: {
        color: "#82CBFF",
        fontSize: 16,
        fontWeight: "600",
        textDecorationLine: "underline",
    },

    tipHeader: {
        marginTop: 2,
        marginBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "baseline",
    },
    tipLabel: {
        color: "rgba(255,255,255,0.75)",
        fontSize: 14,
    },
    tipAmount: {
        color: "white",
        fontSize: 18,
        fontWeight: "700",
    },

    tiersRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginBottom: 14,
    },

    tierPill: {
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.22)",
        borderRadius: 999,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: "transparent",
    },
    tierPillSelected: {
        borderColor: "rgba(130,203,255,0.65)",
        backgroundColor: "rgba(130,203,255,0.14)",
    },
    tierText: {
        color: "rgba(255,255,255,0.78)",
        fontSize: 14,
        fontWeight: "700",
    },
    tierTextSelected: {
        color: "#82CBFF",
    },

    primaryButton: {
        marginTop: 2,
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: "center",
        borderWidth: 0.5,
        borderColor: "#82CBFF",
        backgroundColor: "transparent",
    },
    primaryButtonText: {
        color: "#82CBFF",
        fontSize: 16,
        fontWeight: "800",
    },

    finePrint: {
        marginTop: 10,
        color: "rgba(255,255,255,0.65)",
        fontSize: 12,
        lineHeight: 16,
    },
});
