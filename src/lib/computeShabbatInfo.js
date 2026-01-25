// lib/computeShabbatInfo.js
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

    // Hebcal Location(lat, lon, isIsrael, tzid, city, countryCode, geonameid, elevation)
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

    // Only do Saturday night logic if we have shabbatEnds time (requires location)
    if (location) {
        const isSaturday = anchor.getDay() === 6;
        const ended =
            info.shabbatEnds instanceof Date &&
            now instanceof Date &&
            now.getTime() >= info.shabbatEnds.getTime();

        if (isSaturday && ended) {
            const nextDay = new Date(anchor);
            nextDay.setDate(nextDay.getDate() + 1);
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
    }

    return info;
}

/**
 * ---------- UI view-model helpers ----------
 * Countdown: minutes-only (no seconds), ceil to avoid early minute drop.
 */
function pad2(n) {
    return String(Math.max(0, n)).padStart(2, "0");
}

function diffPartsNoSeconds(targetDate, now) {
    if (!(targetDate instanceof Date) || !(now instanceof Date)) {
        return { days: "00", hours: "00", mins: "00" };
    }

    const ms = Math.max(0, targetDate.getTime() - now.getTime());
    const totalMins = Math.ceil(ms / 60000);

    const days = Math.floor(totalMins / (24 * 60));
    const hours = Math.floor((totalMins % (24 * 60)) / 60);
    const mins = totalMins % 60;

    return {
        days: pad2(days),
        hours: pad2(hours),
        mins: pad2(mins),
    };
}

/**
 * buildShabbatViewModel(info, now, opts)
 * - countdown logic:
 *   - before: countdown to candleTime
 *   - during: hidden (top shows "Shabbat Shalom")
 *   - after: countdown to next candleTime (info will already be next if Sat night ended)
 *
 * Override behavior:
 * - freeze in the screen (you freeze `now` there)
 * - keep countdown visible (but it won’t tick)
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

    // Determine countdown target (same for normal + override)
    let countdownTarget = null;
    if (!isDuring) {
        countdownTarget = candleTime instanceof Date ? candleTime : null;
    }

    // In your UI: when isDuring, you show "Shabbat Shalom" and hide countdown.
    // In override mode, you freeze `now` in the screen, so parts won't tick.
    return {
        status: { isBefore, isDuring },
        hero: {
            title: isDuring ? "Shabbat Shalom" : "Shabbat begins in",
            dateLine: isDuring ? "" : shabbatInfo?.erevShabbatShort ?? "",
        },
        countdown: {
            show: !!countdownTarget && !isDuring, // override still shows (target exists)
            target: countdownTarget,
            parts: countdownTarget
                ? diffPartsNoSeconds(countdownTarget, now)
                : { days: "00", hours: "00", mins: "00" },
        },
        meta: {
            isDevOverride,
        },
    };
}
