import { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import { localIsoToday } from "../utils/datetime";

/**
 * Returns today's local ISO date (YYYY-MM-DD)
 * Updates at midnight + foreground resume
 */
export default function useTodayIsoDay(debugIso = null) {
    const [todayIso, setTodayIso] = useState(() => debugIso ?? localIsoToday());

    const debugRef = useRef(debugIso);

    useEffect(() => {
        debugRef.current = debugIso;
        setTodayIso(debugIso ?? localIsoToday());
    }, [debugIso]);

    useEffect(() => {
        if (debugRef.current) return;

        const tick = () => {
            const next = localIsoToday();
            setTodayIso((prev) => (prev === next ? prev : next));
        };

        const interval = setInterval(tick, 60_000);

        const sub = AppState.addEventListener("change", (state) => {
            if (state === "active") tick();
        });

        return () => {
            clearInterval(interval);
            sub.remove();
        };
    }, []);

    return todayIso;
}
