export function parshaNameToKey(name) {
    return name
        .toLowerCase()
        .replace(/[’']/g, "") // apostrophes
        .replace(/–|—/g, "-") // long dashes
        .replace(/\s+/g, "_")
        .replace(/-/g, "_");
}
