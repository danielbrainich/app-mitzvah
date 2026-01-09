import { HDate } from "@hebcal/core";

/**
 * Date/time helpers used across screens.
 * All functions are "local time" (not UTC) to match what users see on-device.
 */

/** Format a local ISO (YYYY-MM-DD) as a Hebrew date string. */
export function formatHebrewLongFromIso(iso) {
    const d = parseLocalIso(iso);
    if (!d) return "";
    return new HDate(d).toString(); // e.g. "17 Tevet 5786"
}

/** Format a Date as local YYYY-MM-DD. */
export function localIsoDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

/** Today's local YYYY-MM-DD. */
export function localIsoToday() {
    return localIsoDate(new Date());
}

/** Parse YYYY-MM-DD as a LOCAL Date at midnight. */
export function parseLocalIso(iso) {
    if (!iso) return null;
    const [y, m, d] = String(iso).split("-").map(Number);
    if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d))
        return null;
    return new Date(y, m - 1, d, 0, 0, 0, 0);
}

/** Compare two Date objects by local calendar day only (ignores time). */
export function isSameLocalDate(a, b) {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

/** Add minutes without mutating the original Date. */
export function addMinutes(date, mins) {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() + mins);
    return d;
}

/**
 * Round up to the next whole minute.
 * Useful because zmanim can include seconds/millis but UI wants clean times.
 */
export function ceilToMinute(date) {
    const d = new Date(date);
    const hadSeconds = d.getSeconds() > 0 || d.getMilliseconds() > 0;
    d.setSeconds(0, 0);
    if (hadSeconds) d.setMinutes(d.getMinutes() + 1);
    return d;
}

/** Format a Date for display (12h clock). */
export function formatTime12h(date) {
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const amPm = hours >= 12 ? "pm" : "am";
    const formattedHour = hours % 12 === 0 ? 12 : hours % 12;
    return `${formattedHour}:${minutes} ${amPm}`;
}

/**
 * Canonical Gregorian display format:
 * "January 5, 2026"
 */
export const gregorianLongFormatter = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
});

/**
 * Format a local ISO date string (YYYY-MM-DD) as "January 5, 2026".
 */
export function formatGregorianLongFromIso(iso) {
    const d = parseLocalIso(iso);
    if (!d) return "";
    return gregorianLongFormatter.format(d);
}

/**
 * Format a Date as "January 5, 2026".
 */
export function formatGregorianLong(date) {
    if (!(date instanceof Date)) return "";
    return gregorianLongFormatter.format(date);
}
