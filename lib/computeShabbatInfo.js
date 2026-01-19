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

import {
    isSameLocalDate,
    addMinutes,
    formatGregorianLongFromIso,
} from "../utils/datetime";

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

// local-ISO helper (YYYY-MM-DD)
function dateToIsoLocal(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
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
 * Primary computation: returns raw data + formatted date strings.
 * (No "now" logic here — keep it pure.)
 */
export function computeShabbatInfo({
    today,
    todayIso,
    timezone,
    location, // { latitude, longitude, elevation } | null
    candleMins = 18,
    havdalahMins = 42,
}) {
    if (!(today instanceof Date)) {
        throw new Error("computeShabbatInfo: today must be a Date");
    }

    const { friday, saturday } = getUpcomingFridayAndSaturday(today);

    const erevShabbatIso = dateToIsoLocal(friday);
    const yomShabbatIso = dateToIsoLocal(saturday);

    const erevShabbatGregDate = formatGregorianLongFromIso(erevShabbatIso);
    const yomShabbatGregDate = formatGregorianLongFromIso(yomShabbatIso);

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
        friday,
        saturday,

        erevShabbatIso,
        yomShabbatIso,
        erevShabbatGregDate,
        yomShabbatGregDate,

        erevShabbatHebrewDate: new HDate(friday).toString(),
        yomShabbatHebrewDate: new HDate(saturday).toString(),

        fridaySunset,
        saturdaySunset,
        candleTime,
        shabbatEnds,

        endsIntoYomTov: signals.endsIntoYomTov,
        parshaEnglish: signals.parshaEnglish,
        parshaHebrew: signals.parshaHebrew,
        parshaReplacedByHoliday: signals.parshaReplacedByHoliday,

        todayIso,
    };
}

/**
 * ---------- UI view-model helpers ----------
 * Everything "compute-ish" for the screen lives here.
 */

function pad2(n) {
    return String(Math.max(0, n)).padStart(2, "0");
}

function diffParts(targetDate, now) {
    if (!(targetDate instanceof Date) || !(now instanceof Date)) {
        return { days: "00", hours: "00", mins: "00", secs: "00" };
    }
    const ms = Math.max(0, targetDate.getTime() - now.getTime());
    const totalSecs = Math.floor(ms / 1000);

    const days = Math.floor(totalSecs / 86400);
    const hours = Math.floor((totalSecs % 86400) / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    return {
        days: pad2(days),
        hours: pad2(hours),
        mins: pad2(mins),
        secs: pad2(secs),
    };
}

function formatShabbatRange(friday, saturday) {
    if (!(friday instanceof Date) || !(saturday instanceof Date)) {
        return { monthLine: "", dayLine: "" };
    }

    const sameMonth =
        friday.getFullYear() === saturday.getFullYear() &&
        friday.getMonth() === saturday.getMonth();

    const monthFmt = new Intl.DateTimeFormat("en-US", { month: "long" });
    const shortMonthFmt = new Intl.DateTimeFormat("en-US", { month: "short" });
    const yearFmt = new Intl.DateTimeFormat("en-US", { year: "numeric" });

    const friDay = friday.getDate();
    const satDay = saturday.getDate();

    if (sameMonth) {
        return {
            monthLine: monthFmt.format(friday),
            dayLine: `${friDay}-${satDay}`,
        };
    }

    return {
        monthLine: `${shortMonthFmt.format(friday)} - ${shortMonthFmt.format(
            saturday
        )}`,
        dayLine: `${friDay} - ${satDay} (${yearFmt.format(friday)})`,
    };
}

/**
 * buildShabbatViewModel(info, now)
 * - hero title
 * - range strings
 * - status flags
 * - countdown parts + show/hide
 */
export function buildShabbatViewModel(shabbatInfo, now = new Date()) {
    const friday = shabbatInfo?.friday ?? null;
    const saturday = shabbatInfo?.saturday ?? null;
    const range = formatShabbatRange(friday, saturday);

    const candleTime = shabbatInfo?.candleTime ?? null;
    const shabbatEnds = shabbatInfo?.shabbatEnds ?? null;

    const isDuring =
        candleTime instanceof Date &&
        shabbatEnds instanceof Date &&
        now >= candleTime &&
        now < shabbatEnds;

    const isBefore = candleTime instanceof Date && now < candleTime;

    // only show the countdown when we're before Shabbat begins
    const countdownTarget = isBefore ? candleTime : null;

    return {
        range,
        status: { isBefore, isDuring },
        hero: {
            title: isDuring ? "Shabbat Shalom" : "Shabbat this week is",
        },
        countdown: {
            show: !!countdownTarget,
            target: countdownTarget,
            parts: diffParts(countdownTarget, now),
        },
    };
}
