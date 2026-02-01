import { HebrewCalendar, HDate, Event } from "@hebcal/core";
import { parseLocalIso } from "../utils/datetime";
import {
    normalizeHolidayName,
    transformHolidayTitle,
    transformHebrewTitle,
} from "../utils/getHolidayDetails";

/**
 * Date -> local YYYY-MM-DD (stable in local time; avoids UTC shifting).
 */
export function toLocalIsoDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

/**
 * End range: day before the same Hebrew month/day next year.
 * Prevents “wraparound” duplicates from HebrewCalendar.
 */
export function endOfHebrewYearFromTodayExclusive(todayIso) {
    const todayLocal = parseLocalIso(todayIso);
    const h = new HDate(todayLocal);

    const sameHebDateNextYear = new HDate(
        h.getDate(),
        h.getMonth(),
        h.getFullYear() + 1
    ).greg();

    const end = new Date(sameHebDateNextYear);
    end.setDate(end.getDate() - 1);
    end.setHours(23, 59, 59, 999);
    return end;
}

/**
 * Convert Hebcal events -> your app holiday objects.
 * Output shape matches what Holidays.js currently uses.
 */
export function formatHebcalEventsToHolidays(events) {
    return (events || [])
        .filter((ev) => ev instanceof Event)
        .map((ev) => {
            const gregIso = toLocalIsoDate(ev.getDate().greg());
            return {
                id: `${ev.getDesc()}-${gregIso}`,
                title: normalizeHolidayName(ev.getDesc()),
                displayTitle: transformHolidayTitle(ev.getDesc()),
                hebrewTitle: transformHebrewTitle(
                    ev.renderBrief("he-x-NoNikud")
                ), // ← Apply transform here
                date: gregIso,
                hebrewDate: ev.getDate().toString(),
                categories: ev.getCategories(),
            };
        });
}

/**
 * Main compute function: returns { holidays, todayHolidays, upcoming }
 */
export function computeHolidaysInfo({ todayIso, settings = {} }) {
    const {
        minorFasts = true,
        rosheiChodesh = true,
        modernHolidays = true,
        specialShabbatot = true,
    } = settings;

    const start = parseLocalIso(todayIso);
    const end = endOfHebrewYearFromTodayExclusive(todayIso);

    const events = HebrewCalendar.calendar({
        start,
        end,
        isHebrewYear: false,
        candlelighting: false,

        noMinorFast: !minorFasts,
        noSpecialShabbat: !specialShabbatot,
        noModern: !modernHolidays,
        noRoshChodesh: !rosheiChodesh,

        sedrot: false,
        omer: false,
        shabbatMevarchim: false,
        molad: false,
        yomKippurKatan: false,

        locale: "he",
    });

    // 🔍 DEBUG: Holiday coverage (development only)
    // To verify leap year coverage, set dev date to February 15, 2027
    // Expected: Display: 81, Normalized: 51
    // Regular year: Display: 78, Normalized: 49
    if (__DEV__) {
        const uniqueNormalized = new Set();
        const uniqueDisplay = new Set();
        events.forEach((ev) => {
            if (ev instanceof Event) {
                uniqueNormalized.add(normalizeHolidayName(ev.getDesc()));
                uniqueDisplay.add(transformHolidayTitle(ev.getDesc()));
            }
        });
        console.log("=== NORMALIZED (for matching) ===");
        console.log(Array.from(uniqueNormalized).sort());
        console.log("Total:", uniqueNormalized.size);
        console.log("\n=== DISPLAY TITLES (what users see) ===");
        console.log(Array.from(uniqueDisplay).sort());
        console.log("Total:", uniqueDisplay.size);
    }

    const holidays = formatHebcalEventsToHolidays(events);
    const todayHolidays = holidays.filter((h) => h.date === todayIso);
    const upcoming = holidays.filter((h) => h.date > todayIso);

    return { holidays, todayHolidays, upcoming };
}
