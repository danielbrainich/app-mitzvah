/**
 * Removes parenthetical descriptors from holiday names.
 * Example: "Purim (observed)" → "Purim"
 */
export function normalizeHolidayTitle(title) {
    if (!title || typeof title !== "string") return title || "";

    return title
        .replace(/\s*\([^)]*\)/g, "") // remove " (anything)"
        .trim();
}
