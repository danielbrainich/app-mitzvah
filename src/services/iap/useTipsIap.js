import { useEffect, useState, useCallback } from "react";
import { Platform } from "react-native";
import * as Haptics from "expo-haptics";
import * as RNIap from "react-native-iap";

import { initIap, endIap, fetchTipProducts, buyTip } from "./tips";

function makeIapError(code, message) {
    const err = new Error(message || code);
    err.code = code;
    return err;
}

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

                // In dev / unsupported environments, react-native-iap may not work
                if (!RNIap?.initConnection) {
                    console.warn("IAP not available in this environment");
                    if (alive) setReady(false);
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
                    setTipProducts([]);
                    setReady(false);
                }
            } catch (err) {
                console.warn(
                    "IAP initialization failed (expected in dev):",
                    err
                );
                if (alive) {
                    setTipProducts([]);
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
            // Let the UI decide how to message "not ready"
            if (!ready) {
                throw makeIapError(
                    "IAP_NOT_READY",
                    "In-app purchases aren’t available right now."
                );
            }

            if (!amount || typeof amount !== "number" || amount <= 0) {
                throw makeIapError(
                    "INVALID_AMOUNT",
                    "Please select a valid tip amount."
                );
            }

            try {
                setLoading(true);
                setError(null);

                // Optional haptic on start of purchase
                if (Platform.OS === "ios") {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }

                await buyTip(amount);

                // Success: just return. UI will show your PopupModal.
                return true;
            } catch (e) {
                const msg = String(e?.message || "");
                const code = e?.code || "TIP_FAILED";

                const cancelled =
                    code === "E_USER_CANCELLED" ||
                    msg.toLowerCase().includes("cancel");

                if (cancelled) {
                    // If you don't want a "cancelled" popup, let UI treat it
                    // as a non-error by throwing a specific code it can ignore
                    throw makeIapError(
                        "TIP_CANCELLED",
                        msg || "User cancelled"
                    );
                }

                console.error("Tip purchase error:", e);
                setError(msg || "Purchase failed");

                throw makeIapError(code, msg || "Purchase failed");
            } finally {
                setLoading(false);
            }
        },
        [ready]
    );

    return { tipProducts, ready, loading, error, tip };
}
