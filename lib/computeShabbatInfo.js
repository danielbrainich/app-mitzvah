import {
    HebrewCalendar,
    Location as HebcalLocation,
    CandleLightingEvent,
    ParshaEvent,
    HavdalahEvent,
    HDate,
    Zmanim,
    Event as HebcalEvent,
} from "@hebcal/core";

import { isSameLocalDate, addMinutes } from "../utils/datetime";

/**
 * Helpers
 */
function getUpcomingFridayAndSaturday(today) {
    const friday = new Date(today);
    const saturday = new Date(today);

    if (today.getDay() === 6) {
        // Saturday: show current Shabbat (Fri/Sat)
        friday.setDate(today.getDate() - 1);
        saturday.setDate(today.getDate());
    } else {
        // Upcoming Shabbat
        friday.setDate(today.getDate() + (5 - today.getDay()));
        saturday.setTime(friday.getTime());
        saturday.setDate(friday.getDate() + 1);
    }

    return { friday, saturday };
}

function makeHebcalLocation(location, timezone) {
    if (!location) return null;

    const elevation = Number.isFinite(location.elevation)
        ? location.elevation
        : undefined;

    return new HebcalLocation(
        location.latitude,
        location.longitude,
        false,
        timezone,
        undefined,
        "US",
        undefined,
        elevation
    );
}

function floorToMinute(d) {
    if (!(d instanceof Date)) return null;
    const x = new Date(d);
    x.setSeconds(0, 0);
    return x;
}

function computeSundownFromZmanim({ location, timezone, date }) {
    if (!location) return null;
    const hebcalLocation = makeHebcalLocation(location, timezone);
    if (!hebcalLocation) return null;

    const zmanim = new Zmanim(hebcalLocation, date);
    const sunsetRaw = zmanim.sunset();
    if (!(sunsetRaw instanceof Date)) return null;

    return floorToMinute(sunsetRaw);
}

function extractShabbatSignals({ events, friday, saturday }) {
    let fridayCandleTime = null;
    let saturdayCandleTime = null; // indicates Yom Tov candle lighting Saturday night
    let havdalahTime = null;

    let parshaEnglish = null;
    let parshaHebrew = null;

    let holidayOnSaturday = false;

    for (const ev of events || []) {
        if (ev instanceof CandleLightingEvent) {
            if (!(ev.eventTime instanceof Date)) continue;

            if (isSameLocalDate(ev.eventTime, friday)) {
                if (!fridayCandleTime) fridayCandleTime = ev.eventTime;
                continue;
            }

            if (isSameLocalDate(ev.eventTime, saturday)) {
                if (!saturdayCandleTime) saturdayCandleTime = ev.eventTime;
                continue;
            }
        }

        if (ev instanceof HavdalahEvent) {
            if (!(ev.eventTime instanceof Date)) continue;
            if (!isSameLocalDate(ev.eventTime, saturday)) continue;
            havdalahTime = ev.eventTime;
            continue;
        }

        if (ev instanceof ParshaEvent) {
            parshaEnglish = ev.render("en");
            parshaHebrew = ev.renderBrief("he-x-NoNikud");
            continue;
        }

        // holiday detection (works even without location)
        if (!holidayOnSaturday && ev instanceof HebcalEvent) {
            const d = typeof ev.getDate === "function" ? ev.getDate() : null;
            const g = d && typeof d.greg === "function" ? d.greg() : null;

            if (g instanceof Date && isSameLocalDate(g, saturday)) {
                const cats =
                    typeof ev.getCategories === "function"
                        ? ev.getCategories()
                        : [];
                if (cats.includes("major") || cats.includes("chol_hamoed")) {
                    holidayOnSaturday = true;
                }
            }
        }
    }

    const endsIntoYomTov = !!saturdayCandleTime;
    const parshaReplacedByHoliday =
        holidayOnSaturday && (!parshaEnglish || !parshaHebrew);

    return {
        fridayCandleTime,
        havdalahTime,
        endsIntoYomTov,
        parshaEnglish,
        parshaHebrew,
        parshaReplacedByHoliday,
    };
}

/**
 * - Computation returns dates + strings
 */
export function computeShabbatInfo({
    today,
    todayIso,
    timezone,
    location, // { latitude, longitude, elevation } | null
    candleMins = 18,
    havdalahMins = 42,
}) {
    if (!(today instanceof Date))
        throw new Error("computeShabbatInfo: today must be a Date");

    const { friday, saturday } = getUpcomingFridayAndSaturday(today);

    // include Saturday night
    const end = new Date(saturday);
    end.setDate(end.getDate() + 1);
    end.setHours(0, 0, 0, 0);

    const hebcalLocation = location
        ? makeHebcalLocation(location, timezone)
        : null;

    const events = HebrewCalendar.calendar({
        start: friday,
        end,
        sedrot: true,
        ...(hebcalLocation
            ? {
                location: hebcalLocation,
                candlelighting: true,
                candleLightingMins: candleMins,
                havdalahMins,
            }
            : {}),
    });

    const signals = extractShabbatSignals({ events, friday, saturday });

    const fridaySunset = location
        ? computeSundownFromZmanim({ location, timezone, date: friday })
        : null;

    const saturdaySunset = location
        ? computeSundownFromZmanim({ location, timezone, date: saturday })
        : null;

    const candleTime = fridaySunset
        ? addMinutes(fridaySunset, -candleMins)
        : null;
    const shabbatEnds = saturdaySunset
        ? addMinutes(saturdaySunset, havdalahMins)
        : null;

    return {
        // dates
        friday,
        saturday,

        // hebrew dates (strings)
        erevShabbatHebrewDate: new HDate(friday).toString(),
        yomShabbatHebrewDate: new HDate(saturday).toString(),

        // raw Dates for times
        fridaySunset,
        saturdaySunset,
        candleTime,
        shabbatEnds,

        // parsha / yom tov flags
        endsIntoYomTov: signals.endsIntoYomTov,
        parshaEnglish: signals.parshaEnglish,
        parshaHebrew: signals.parshaHebrew,
        parshaReplacedByHoliday: signals.parshaReplacedByHoliday,

        // passthrough
        todayIso,
    };
}
