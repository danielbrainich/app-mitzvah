import { HOLIDAY_DETAILS } from "../data/holidayDetails";

// For matching to HOLIDAY_DETAILS
export function normalizeHolidayName(name) {
    if (!name || typeof name !== "string") return null;

    return name
        .trim()
        .replace(/^Erev\s+/i, "")
        .replace(/:\s*\d+.*$/i, "") // Chanukah: 6 Candles → Chanukah
        .replace(/\s+\d{4,}$/i, "") // Rosh Hashana 5787 → Rosh Hashana
        .replace(/\s+\b(I|II|III|IV|V|VI|VII|VIII)\b/i, "")
        .replace(/\s*\(.*?\)\s*/g, "")
        .replace(/'/g, "'")
        .trim();
}

// For display transformation
export function transformHolidayTitle(name) {
    if (!name || typeof name !== "string") return name;

    // Transform Chanukah candles to nights
    if (name.includes("Chanukah:")) {
        const candleMatch = name.match(/Chanukah:\s*(\d+)\s+Candles?/i);
        if (candleMatch) {
            const num = parseInt(candleMatch[1]);
            const ordinal = getOrdinal(num);
            return `Chanukah: ${ordinal} Night`;
        }
        // Handle "Chanukah: 8th Day" - keep it as is (don't transform to "8th Night")
        if (name.includes("8th Day")) {
            return name; // Keep "Chanukah: 8th Day"
        }
    }

    // Strip (CH''M) from display
    const cleaned = name.replace(/\s*\(CH''M\)\s*/g, "");

    return cleaned;
}

export function transformHebrewTitle(name) {
    if (!name || typeof name !== "string") return name;
    return name.replace(/\s*\(חוה״מ\)\s*/g, "");
}

function getOrdinal(num) {
    const ordinals = {
        1: "1st",
        2: "2nd",
        3: "3rd",
        4: "4th",
        5: "5th",
        6: "6th",
        7: "7th",
        8: "8th",
    };
    return ordinals[num] || `${num}th`;
}

export function getHolidayDetailsByName(name) {
    if (!name) return null;

    // 1) exact match after quote normalization
    const exact = name.trim().replace(/'/g, "’");
    if (HOLIDAY_DETAILS[exact]) return HOLIDAY_DETAILS[exact];

    // 2) normalized match
    const normalized = normalizeHolidayName(name);
    if (normalized && HOLIDAY_DETAILS[normalized]) {
        return HOLIDAY_DETAILS[normalized];
    }

    return null;
}
