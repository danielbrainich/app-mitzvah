import * as RNIap from "react-native-iap";

export const TIP_PRODUCT_IDS = [
    "appmitzvah.tip_1",
    "appmitzvah.tip_2",
    "appmitzvah.tip_5",
    "appmitzvah.tip_10",
    "appmitzvah.tip_18",
];

export async function initIap() {
    await RNIap.initConnection();
}

export async function endIap() {
    try {
        await RNIap.endConnection();
    } catch {}
}

const amountFromId = (id = "") => {
    const n = Number(id.split("_").pop());
    return Number.isFinite(n) ? n : 0;
};

export async function fetchTipProducts() {
    const products = await RNIap.getProducts({ skus: TIP_PRODUCT_IDS });
    return [...products].sort(
        (a, b) => amountFromId(a.productId) - amountFromId(b.productId)
    );
}

export async function buyTip(amount) {
    const productId = `appmitzvah.tip_${amount}`;

    const purchase = await RNIap.requestPurchase({ sku: productId });
    const p = Array.isArray(purchase) ? purchase[0] : purchase;

    if (p) {
        await RNIap.finishTransaction({ purchase: p, isConsumable: true });
    }

    return p;
}
