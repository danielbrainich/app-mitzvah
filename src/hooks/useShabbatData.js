import { useState, useCallback, useEffect, useMemo } from "react";
import { parseLocalIso } from "../utils/datetime";
import { computeShabbatInfo } from "../lib/computeShabbatInfo";
import useTodayIsoDay from "./useTodayIsoDay";

export function useShabbatData({ location, candleMins, havdalahMins, now }) {
    const [shabbatInfo, setShabbatInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const todayIso = useTodayIsoDay();
    const timezone = useMemo(
        () => Intl.DateTimeFormat().resolvedOptions().timeZone,
        []
    );

    const fetchShabbatInfo = useCallback(async () => {
        if (!todayIso) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const today = parseLocalIso(todayIso);
            if (!today) {
                throw new Error("Invalid date format");
            }

            // Compute even without location (will get dates + parsha, but not times)
            const result = computeShabbatInfo({
                today,
                todayIso,
                timezone,
                location: location || null, // Pass null if no location
                candleMins,
                havdalahMins,
                now,
            });

            setShabbatInfo(result);
        } catch (e) {
            console.error("[Shabbat] Error:", e);
            setError(e.message || "Failed to compute Shabbat times");
            setShabbatInfo(null);
        } finally {
            setLoading(false);
        }
    }, [todayIso, timezone, location, candleMins, havdalahMins, now]);

    useEffect(() => {
        fetchShabbatInfo();
    }, [fetchShabbatInfo]);

    return { shabbatInfo, loading, error, timezone };
}
