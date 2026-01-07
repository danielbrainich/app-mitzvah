// utils/useTodayIso.js
import { useEffect, useMemo, useState } from "react";

/**
 * Returns local YYYY-MM-DD for a given Date.
 * Why: avoids UTC shifting from Date.toISOString().
 */
function toLocalIsoDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

/**
 * MS until next local midnight.
 * Why: schedule a single tick that updates "today" when the calendar day flips.
 */
function msUntilNextLocalMidnight() {
    const now = new Date();
    const next = new Date(now);
    next.setDate(now.getDate() + 1);
    next.setHours(0, 0, 0, 0);
    return next.getTime() - now.getTime();
}

/**
 * useTodayIso
 *
 * - Provides a single source of truth for "todayIso" across screens.
 * - Automatically updates at the next local midnight.
 *
 * Options:
 * - debugIso (DEV only): force a specific local ISO day for testing.
 */
export default function useTodayIso({ debugIso = null } = {}) {
    // Use debug day in development if provided, otherwise actual local day.
    const initial = useMemo(() => {
        if (__DEV__ && debugIso) return debugIso;
        return toLocalIsoDate(new Date());
    }, [debugIso]);

    const [todayIso, setTodayIso] = useState(initial);

    useEffect(() => {
        // If debugIso changes in DEV, update immediately.
        if (__DEV__ && debugIso) {
            setTodayIso(debugIso);
            return;
        }

        // Otherwise, tick at midnight and then repeat.
        let timeoutId = null;
        const schedule = () => {
            timeoutId = setTimeout(() => {
                setTodayIso(toLocalIsoDate(new Date()));
                schedule();
            }, msUntilNextLocalMidnight());
        };

        schedule();

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [debugIso]);

    return todayIso;
}
