import { HOLIDAY_DETAILS } from "../data/holidayDetails";

function normalizeHolidayName(name: string | null | undefined) {
    if (!name) return null;

    return (
        name
            .trim()
            // strip Hebcal modifiers
            .replace(/^Erev\s+/i, "")
            .replace(/:\s*\d+.*$/i, "") // Chanukah: 6 Candles
            .replace(/\s+\d{4}$/i, "") // Rosh Hashana 5787
            .replace(/\s+\b(I|II|III|IV|V|VI|VII|VIII)\b/i, "")
            .replace(/\s*\(.*?\)\s*/g, "")
            // normalize quotes LAST (Hebcal uses straight apostrophes sometimes)
            .replace(/'/g, "’")
    );
}

export function getHolidayDetailsByName(name: string | null | undefined) {
    if (!name) return null;

    // 1) exact match after quote normalization (cheap and helps when no other cleanup needed)
    const exact = name.trim().replace(/'/g, "’");
    if (HOLIDAY_DETAILS[exact]) return HOLIDAY_DETAILS[exact];

    // 2) normalized match
    const normalized = normalizeHolidayName(name);
    if (normalized && HOLIDAY_DETAILS[normalized])
        return HOLIDAY_DETAILS[normalized];

    return null;
}
