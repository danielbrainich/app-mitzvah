import { PARSHIOT, getParshaDataByName } from "../data/parshiot";

/**
 * Normalize a parsha name for lookup
 */
export function normalizeParshaName(name) {
    if (!name || typeof name !== "string") return "";
    return name
        .replace(/^Parashat\s+/i, "")
        .replace(/\u2019/g, "'") // curly apostrophe
        .replace(/\s+/g, " ")
        .trim();
}

/**
 * Convert parsha name to key format for PARSHIOT lookup
 */
function parshaNameToKey(name) {
    if (!name) return "";
    return name
        .toLowerCase()
        .replace(/['']/g, "")
        .replace(/–|—/g, "-")
        .replace(/\s+/g, "_")
        .replace(/-/g, "_");
}

/**
 * Find parsha data by name - tries multiple lookup strategies
 */
export function findParshaData(parshaName) {
    if (!parshaName) return null;

    const normalized = normalizeParshaName(parshaName);

    // 1) Try direct lookup via getParshaDataByName
    let data = getParshaDataByName(normalized);
    if (data) return data;

    // 2) Try with normalized hyphens for double-parshot
    if (normalized.includes("-")) {
        data = getParshaDataByName(normalized.replace(/\s*-\s*/g, "-"));
        if (data) return data;
    }

    // 3) Last resort: manual key lookup
    const key = parshaNameToKey(normalized);
    data = PARSHIOT?.[key] ?? null;

    return data;
}
