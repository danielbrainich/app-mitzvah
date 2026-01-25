import { HOLIDAY_DETAILS } from "../data/holidayDetails";

/**
 * Normalize a holiday name by removing Hebcal modifiers and standardizing formatting.
 * Examples:
 *   "Erev Pesach" → "Pesach"
 *   "Chanukah: 6 Candles" → "Chanukah"
 *   "Rosh Hashana 5787" → "Rosh Hashana"
 */
function normalizeHolidayName(name) {
    if (!name || typeof name !== "string") return null;

    return (
        name
            .trim()
            // strip Hebcal modifiers
            .replace(/^Erev\s+/i, "")
            .replace(/:\s*\d+.*$/i, "") // Chanukah: 6 Candles
            .replace(/\s+\d{4}$/i, "") // Rosh Hashana 5787
            .replace(/\s+\b(I|II|III|IV|V|VI|VII|VIII)\b/i, "")
            .replace(/\s*\(.*?\)\s*/g, "")
            // normalize quotes LAST
            .replace(/'/g, "'")
            .trim() // trim again after replacements in case of edge whitespace
    );
}

/**
 * Look up holiday details by name, handling Hebcal's various naming conventions.
 * Returns the holiday details object or null if not found.
 */
export function getHolidayDetailsByName(name) {
    if (!name || typeof name !== "string") return null;

    // 1) exact match after quote normalization
    const exact = name.trim().replace(/'/g, "'");
    if (HOLIDAY_DETAILS[exact]) return HOLIDAY_DETAILS[exact];

    // 2) normalized match
    const normalized = normalizeHolidayName(name);
    if (normalized && HOLIDAY_DETAILS[normalized]) {
        return HOLIDAY_DETAILS[normalized];
    }

    return null;
}
