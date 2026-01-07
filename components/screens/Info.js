import React, { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Linking,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { ui } from "../../styles/theme";

const TIP_TIERS = [1, 2, 5, 10, 18];
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

    // Placeholder until I wire in IAP:
    const handleTip = () => {
        Alert.alert(
            "Tip (In-App Purchase)",
            `Selected: $${amount}\n\nNext step: create IAP products (tip_1, tip_2, tip_5, tip_10, tip_18) and call purchase().`
        );
    };

    return (
        <SafeAreaView style={ui.container}>
            <ScrollView contentContainerStyle={ui.screen}>
                {!fontsLoaded ? null : (
                    <>
                        <View style={ui.card}>
                            <Text style={ui.cardTitle}>About</Text>
                            <Text style={ui.paragraph}>
                                AppMitzvah was created by Daniel Brainich and
                                designed by Andrea Portillo.
                            </Text>
                            <Text style={ui.paragraph}>
                                It was inspired by isitajewishholiday.com and
                                uses @hebcal/core to calculate times and Hebrew
                                dates.
                            </Text>
                        </View>

                        <View style={ui.card}>
                            <Text style={ui.cardTitle}>Contact</Text>
                            <Text style={ui.paragraph}>
                                For bugs, feedback, or questions:
                            </Text>
                            <TouchableOpacity
                                onPress={() =>
                                    handleOpenUrl(`mailto:${SUPPORT_EMAIL}`)
                                }
                                activeOpacity={0.8}
                            >
                                <Text style={ui.link}>{SUPPORT_EMAIL}</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={ui.card}>
                            <Text style={ui.cardTitle}>Support</Text>
                            <Text style={ui.paragraph}>
                                If you find this app fun and useful, please
                                consider leaving a tip!
                            </Text>

                            <View style={ui.infoTiersRow}>
                                {TIP_TIERS.map((v) => {
                                    const selected = v === amount;
                                    return (
                                        <TouchableOpacity
                                            key={v}
                                            onPress={() => setAmount(v)}
                                            activeOpacity={0.85}
                                            style={[
                                                ui.infoTierPill,
                                                selected
                                                    ? ui.infoTierPillSelected
                                                    : null,
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    ui.infoTierText,
                                                    selected
                                                        ? ui.infoTierTextSelected
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
                                style={ui.primaryButton}
                                onPress={handleTip}
                                activeOpacity={0.85}
                            >
                                <Text style={ui.primaryButtonText}>
                                    Tip ${amount}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={ui.infoBottomSpacer} />
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
