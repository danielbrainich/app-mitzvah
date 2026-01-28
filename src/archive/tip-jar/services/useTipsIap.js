import { useEffect, useState, useCallback } from "react";
import { Alert, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import * as RNIap from "react-native-iap"; // Add this import
import { initIap, endIap, fetchTipProducts, buyTip } from "./tips";

export function useTipsIap() {
    const [tipProducts, setTipProducts] = useState([]);
    const [ready, setReady] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let alive = true;

        (async () => {
            try {
                setError(null);

                // Check if IAP is available
                if (!RNIap.initConnection) {
                    console.warn("IAP not available in this environment");
                    setReady(false);
                    return;
                }

                await initIap();
                if (!alive) return;

                const products = await fetchTipProducts();
                if (!alive) return;

                if (Array.isArray(products) && products.length > 0) {
                    setTipProducts(products);
                    setReady(true);
                } else {
                    console.warn("No tip products available");
                    setReady(false);
                }
            } catch (err) {
                console.warn(
                    "IAP initialization failed (expected in dev):",
                    err.message
                );
                if (alive) {
                    setReady(false);
                }
            }
        })();

        return () => {
            alive = false;
            try {
                endIap();
            } catch (err) {
                console.debug("Error ending IAP:", err);
            }
        };
    }, []);

    const tip = useCallback(
        async (amount) => {
            if (!ready) {
                Alert.alert(
                    "Tips unavailable",
                    "In-app purchases aren't ready yet."
                );
                return;
            }

            if (!amount || typeof amount !== "number" || amount <= 0) {
                Alert.alert(
                    "Invalid amount",
                    "Please select a valid tip amount."
                );
                return;
            }

            try {
                setLoading(true);
                setError(null);

                // Haptics with platform check
                if (Platform.OS === "ios" || Platform.OS === "android") {
                    await Haptics.impactAsync(
                        Haptics.ImpactFeedbackStyle.Light
                    ).catch(() => {}); // Silent fail for haptics
                }

                await buyTip(amount);

                Alert.alert("Thank you!", "Your tip means a lot! 💙");
            } catch (e) {
                console.error("Tip purchase error:", e);

                const msg = String(e?.message || "");
                const code = e?.code || "";

                const cancelled =
                    code === "E_USER_CANCELLED" ||
                    msg.toLowerCase().includes("cancel");

                if (cancelled) {
                    Alert.alert(
                        "Tip cancelled",
                        "No worries — thanks for considering it!"
                    );
                } else {
                    // Log the actual error for debugging
                    console.error("IAP Error details:", { code, msg });
                    setError(msg || "Purchase failed");

                    Alert.alert(
                        "Tip failed",
                        "Something went wrong. Please try again or contact support."
                    );
                }
            } finally {
                setLoading(false);
            }
        },
        [ready]
    );

    return { tipProducts, ready, loading, error, tip };
}
