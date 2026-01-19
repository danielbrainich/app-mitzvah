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

function normalizeToLocalNoon(d) {
    if (!(d instanceof Date)) return null;
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0, 0);
}

function formatShortNoYear(d) {
    if (!(d instanceof Date)) return "";
    return new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    }).format(d);
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
 * Internal: compute Shabbat data for a given anchor date (already normalized).
 */
function computeForAnchor({
    anchor,
    todayIso,
    timezone,
    location,
    candleMins,
    havdalahMins,
}) {
    const { friday, saturday } = getUpcomingFridayAndSaturday(anchor);

    const erevShabbatIso = dateToIsoLocal(friday);
    const yomShabbatIso = dateToIsoLocal(saturday);

    const erevShabbatGregDate = formatGregorianLongFromIso(erevShabbatIso);
    const yomShabbatGregDate = formatGregorianLongFromIso(yomShabbatIso);

    const erevShabbatShort = formatShortNoYear(friday);
    const yomShabbatShort = formatShortNoYear(saturday);

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

        erevShabbatShort,
        yomShabbatShort,

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
 * Primary computation:
 * - uses "today" (which comes from useTodayIsoDay, and may be overridden)
 * - normalizes to local noon
 * - special-case: Saturday AFTER Shabbat ends => compute NEXT Shabbat week
 */
export function computeShabbatInfo({
    today,
    todayIso,
    timezone,
    location,
    candleMins = 18,
    havdalahMins = 42,

    // optional "now" for week switching logic (Saturday after Shabbat ends)
    // In normal mode: pass new Date()
    // In override mode: pass local-noon of the overridden date
    now = new Date(),
}) {
    if (!(today instanceof Date)) {
        throw new Error("computeShabbatInfo: today must be a Date");
    }

    const anchor = normalizeToLocalNoon(today);
    let info = computeForAnchor({
        anchor,
        todayIso,
        timezone,
        location,
        candleMins,
        havdalahMins,
    });

    // If it's Saturday night *after* Havdalah, switch to next Shabbat
    const isSaturday = anchor.getDay() === 6;
    const ended =
        info.shabbatEnds instanceof Date &&
        now instanceof Date &&
        now.getTime() >= info.shabbatEnds.getTime();

    if (isSaturday && ended) {
        const nextDay = new Date(anchor);
        nextDay.setDate(nextDay.getDate() + 1); // Sunday
        const nextAnchor = normalizeToLocalNoon(nextDay);

        info = computeForAnchor({
            anchor: nextAnchor,
            todayIso,
            timezone,
            location,
            candleMins,
            havdalahMins,
        });
    }

    return info;
}

/**
 * ---------- UI view-model helpers ----------
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

/**
 * buildShabbatViewModel(info, now, opts)
 * - countdown logic:
 *   - before: countdown to candleTime
 *   - during: zeroes (or hidden, your call)
 *   - after: countdown to next candleTime (info will already be next if Sat night ended)
 */
export function buildShabbatViewModel(
    shabbatInfo,
    now = new Date(),
    opts = {}
) {
    const isDevOverride = !!opts.isDevOverride;

    const candleTime = shabbatInfo?.candleTime ?? null;
    const shabbatEnds = shabbatInfo?.shabbatEnds ?? null;

    const isDuring =
        candleTime instanceof Date &&
        shabbatEnds instanceof Date &&
        now >= candleTime &&
        now < shabbatEnds;

    const isBefore = candleTime instanceof Date && now < candleTime;

    // If override: freeze view, hide countdown (recommended)
    if (isDevOverride) {
        return {
            status: { isBefore: false, isDuring },
            hero: {
                title: isDuring ? "Shabbat Shalom" : "Shabbat this week begins",
                dateLine: isDuring ? "" : shabbatInfo?.erevShabbatShort ?? "",
            },
            countdown: {
                show: false,
                parts: { days: "00", hours: "00", mins: "00", secs: "00" },
            },
        };
    }

    let countdownTarget = null;

    if (isBefore) {
        countdownTarget = candleTime;
    } else if (isDuring) {
        countdownTarget = null;
    } else {
        // After: count down to the *next* candle time
        // (If Saturday-after-end, computeShabbatInfo already switched weeks)
        countdownTarget = candleTime instanceof Date ? candleTime : null;
    }

    return {
        status: { isBefore, isDuring },
        hero: {
            title: isDuring ? "Shabbat Shalom" : "Shabbat this week begins",
            dateLine: isDuring ? "" : shabbatInfo?.erevShabbatShort ?? "",
        },
        countdown: {
            show: !!countdownTarget && !isDuring,
            target: countdownTarget,
            parts: countdownTarget
                ? diffParts(countdownTarget, now)
                : { days: "00", hours: "00", mins: "00", secs: "00" },
        },
    };
}
