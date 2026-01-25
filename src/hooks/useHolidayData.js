import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { computeHolidaysInfo } from "../lib/computeHolidaysinfo";
import useTodayIsoDay from "./useTodayIsoDay";

export function useHolidayData() {
    const { minorFasts, rosheiChodesh, modernHolidays } = useSelector(
        (state) => state.settings
    );

    const todayIso = useTodayIsoDay();

    const [holidays, setHolidays] = useState([]);
    const [todayHolidays, setTodayHolidays] = useState([]);
    const [upcoming, setUpcoming] = useState([]);

    const fetchHolidays = useCallback(() => {
        const result = computeHolidaysInfo({
            todayIso,
            settings: { minorFasts, rosheiChodesh, modernHolidays },
        });

        setHolidays(result.holidays);
        setTodayHolidays(result.todayHolidays);
        setUpcoming(result.upcoming);
    }, [todayIso, minorFasts, rosheiChodesh, modernHolidays]);

    useEffect(() => {
        fetchHolidays();
    }, [fetchHolidays]);

    return {
        holidays,
        todayHolidays,
        upcoming,
        todayIso,
    };
}
