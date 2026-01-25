/**
 * Removes parenthetical descriptors from holiday names.
 */
export function normalizeHolidayTitle(title) {
    if (!title || typeof title !== "string") return title;

    return title
        .replace(/\s*\([^)]*\)/g, "") // remove " (anything)"
        .trim();
}
