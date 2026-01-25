import { useState, useCallback, useEffect, useMemo } from "react";
import { parseLocalIso } from "../utils/datetime";
import { computeShabbatInfo } from "../lib/computeShabbatInfo";
import useTodayIsoDay from "./useTodayIsoDay";

export function useShabbatData({ location, candleMins, havdalahMins }) {
    const [shabbatInfo, setShabbatInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    const todayIso = useTodayIsoDay();
    const timezone = useMemo(
        () => Intl.DateTimeFormat().resolvedOptions().timeZone,
        []
    );

    const fetchShabbatInfo = useCallback(async () => {
        try {
            setLoading(true);
            const today = parseLocalIso(todayIso);
            if (!today) return;

            const result = computeShabbatInfo({
                today,
                todayIso,
                timezone,
                location,
                candleMins,
                havdalahMins,
                now: new Date(),
            });

            setShabbatInfo(result);
        } catch (e) {
            console.error("[Shabbat] Error:", e);
        } finally {
            setLoading(false);
        }
    }, [todayIso, timezone, location, candleMins, havdalahMins]);

    useEffect(() => {
        fetchShabbatInfo();
    }, [fetchShabbatInfo]);

    return { shabbatInfo, loading, timezone };
}
