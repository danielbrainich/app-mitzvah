import { useEffect, useState, useCallback } from "react";
import { Alert } from "react-native";
import * as Haptics from "expo-haptics";
import { initIap, endIap, fetchTipProducts, buyTip } from "./tips";

export function useTipsIap() {
    const [tipProducts, setTipProducts] = useState([]);
    const [ready, setReady] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let alive = true;

        (async () => {
            try {
                await initIap();
                if (!alive) return;

                const products = await fetchTipProducts();
                if (!alive) return;

                setTipProducts(products);
                setReady(true);
            } catch {
                setReady(false);
            }
        })();

        return () => {
            alive = false;
            endIap();
        };
    }, []);

    const tip = useCallback(
        async (amount) => {
            if (!ready) {
                Alert.alert(
                    "Tips unavailable",
                    "In-app purchases aren’t ready yet."
                );
                return;
            }

            try {
                setLoading(true);
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                await buyTip(amount);
                Alert.alert("Thank you!", "Your tip means a lot");
            } catch (e) {
                const msg = String(e?.message || "");
                const cancelled =
                    e?.code === "E_USER_CANCELLED" ||
                    msg.toLowerCase().includes("cancel");

                if (cancelled) {
                    Alert.alert(
                        "Tip cancelled",
                        "No worries — thanks for supporting!"
                    );
                } else {
                    Alert.alert(
                        "Tip failed",
                        "Something went wrong. Please try again."
                    );
                }
            } finally {
                setLoading(false);
            }
        },
        [ready]
    );

    return { tipProducts, ready, loading, tip };
}
