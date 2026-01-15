import { HebrewCalendar, HDate, Event } from "@hebcal/core";
import { parseLocalIso } from "../utils/datetime";

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
                title: ev.getDesc(),
                hebrewTitle: ev.renderBrief("he-x-NoNikud"),
                date: gregIso,
                hebrewDate: ev.getDate().toString(),
                categories: ev.getCategories(),
            };
        });
}

/**
 * Main compute function: returns { holidays, todayHolidays, upcoming }
 * Keeps behavior identical to your current Holidays.js.
 */
export function computeHolidaysInfo({ todayIso, settings = {} }) {
    const {
        minorFasts = true,
        rosheiChodesh = true,
        modernHolidays = true,
    } = settings;

    const start = parseLocalIso(todayIso);
    const end = endOfHebrewYearFromTodayExclusive(todayIso);

    const events = HebrewCalendar.calendar({
        start,
        end,
        isHebrewYear: false,
        candlelighting: false,

        noMinorFast: !minorFasts,
        noSpecialShabbat: true,
        noModern: !modernHolidays,
        noRoshChodesh: !rosheiChodesh,

        sedrot: false,
        omer: false,
        shabbatMevarchim: false,
        molad: false,
        yomKippurKatan: false,

        locale: "he",
    });

    const holidays = formatHebcalEventsToHolidays(events);
    const todayHolidays = holidays.filter((h) => h.date === todayIso);
    const upcoming = holidays.filter((h) => h.date > todayIso);

    return { holidays, todayHolidays, upcoming };
}
