import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { computeHolidaysInfo } from "../lib/computeHolidaysinfo";
import useTodayIsoDay from "./useTodayIsoDay";

export function useHolidayData() {
    const { minorFasts, rosheiChodesh, modernHolidays, specialShabbatot } = useSelector(
        (state) => state.settings
    );

    const todayIso = useTodayIsoDay();

    const [holidays, setHolidays] = useState([]);
    const [todayHolidays, setTodayHolidays] = useState([]);
    const [upcoming, setUpcoming] = useState([]);
    const [error, setError] = useState(null);

    const fetchHolidays = useCallback(() => {
        if (!todayIso) return; // Wait for todayIso to be available

        try {
            setError(null);
            const result = computeHolidaysInfo({
                todayIso,
                settings: { minorFasts, rosheiChodesh, modernHolidays, specialShabbatot },
            });

            setHolidays(result.holidays || []);
            setTodayHolidays(result.todayHolidays || []);
            setUpcoming(result.upcoming || []);
        } catch (err) {
            console.error("Error computing holidays:", err);
            setError(err.message || "Failed to compute holidays");
            // Keep existing data on error rather than clearing it
        }
    }, [todayIso, minorFasts, rosheiChodesh, modernHolidays, specialShabbatot]);

    useEffect(() => {
        fetchHolidays();
    }, [fetchHolidays]);

    return {
        holidays,
        todayHolidays,
        upcoming,
        todayIso,
        error,
    };
}
