// screens/Info.js
import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Linking,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";

const TIP_TIERS = [1, 2, 5, 10, 18];

// TODO: replace
const SUPPORT_EMAIL = "support@example.com";

export default function Info() {
    const [fontsLoaded] = useFonts({
        Nayuki: require("../../assets/fonts/NayukiRegular.otf"),
    });

    const [amount, setAmount] = useState(5);

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

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.screen}>
                {!fontsLoaded ? null : (
                    <>
                        <Text style={styles.pageHeader}>Info</Text>

                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>About</Text>
                            <Text style={styles.paragraph}>
                                AppMitzvah was created by Daniel Brainich and
                                designed by Andrea Portillo.
                            </Text>
                            <Text style={styles.paragraph}>
                                It was inspired by isitajewishholiday.com and
                                uses @hebcal/core to calculate times and Hebrew
                                dates.
                            </Text>
                        </View>
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
                                If you find this app fun and useful, please
                                consider leaving a tip!
                            </Text>

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
        paddingTop: 44,
        paddingBottom: 24,
    },

    pageHeader: {
        color: "white",
        fontSize: 30,
        marginBottom: 22,
        fontFamily: "Nayuki",
        alignSelf: "center"
    },

    card: {
        backgroundColor: "#202020",
        borderRadius: 18,
        padding: 18,
        marginBottom: 18,
    },

    cardTitle: {
        color: "#82CBFF",
        fontSize: 22,
        marginBottom: 10,
        fontWeight: 700,
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
        marginBottom: 18,
        marginTop: 4,
    },

    tierPill: {
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.22)",
        borderRadius: 999,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: "transparent",
        margin: 5
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
});
