import * as RNIap from "react-native-iap";

export const TIP_PRODUCT_IDS = [
    "appmitzvah.tip_1",
    "appmitzvah.tip_2",
    "appmitzvah.tip_3",
    "appmitzvah.tip_4",
    "appmitzvah.tip_5",
];

export async function initIap() {
    try {
        await RNIap.initConnection();
    } catch (err) {
        console.error("Failed to initialize IAP connection:", err);
        throw err; // Re-throw so hook can handle it
    }
}

export async function endIap() {
    try {
        await RNIap.endConnection();
    } catch (err) {
        // Silent fail - this is cleanup, not critical
        console.debug("Error ending IAP connection:", err);
    }
}

/**
 * Extract tip amount from product ID
 * e.g., "appmitzvah.tip_18" → 18
 */
const amountFromId = (id) => {
    if (!id || typeof id !== "string") return 0;
    const parts = id.split("_");
    const n = Number(parts[parts.length - 1]);
    return Number.isFinite(n) && n > 0 ? n : 0;
};

export async function fetchTipProducts() {
    try {
        const products = await RNIap.getProducts({ skus: TIP_PRODUCT_IDS });

        if (!Array.isArray(products)) {
            console.error("Invalid products response:", products);
            return [];
        }

        // Sort by amount and filter out any invalid products
        return products
            .filter((p) => p && p.productId)
            .sort(
                (a, b) => amountFromId(a.productId) - amountFromId(b.productId)
            );
    } catch (err) {
        console.error("Failed to fetch tip products:", err);
        throw err; // Re-throw so hook can handle it
    }
}

export async function buyTip(amount) {
    if (!amount || typeof amount !== "number" || amount <= 0) {
        throw new Error("Invalid tip amount");
    }

    const productId = `appmitzvah.tip_${amount}`;

    // Verify this product ID exists in our list
    if (!TIP_PRODUCT_IDS.includes(productId)) {
        throw new Error(`Invalid product ID: ${productId}`);
    }

    try {
        const purchase = await RNIap.requestPurchase({ sku: productId });
        const p = Array.isArray(purchase) ? purchase[0] : purchase;

        if (!p) {
            throw new Error("Purchase returned empty result");
        }

        // Finish the transaction (consumable, so it can be purchased again)
        await RNIap.finishTransaction({ purchase: p, isConsumable: true });

        return p;
    } catch (err) {
        console.error("Purchase failed:", err);

        // If purchase started but finishTransaction failed, try to finish it
        if (err.message && err.message.includes("finish")) {
            console.warn("Attempting to finish orphaned transaction");
            // This is a recovery scenario - might not work but worth trying
        }

        throw err; // Re-throw so hook can handle user-facing errors
    }
}
