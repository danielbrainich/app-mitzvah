import { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import { localIsoToday } from "../utils/datetime";

/**
 * Returns today's local ISO date (YYYY-MM-DD).
 *
 * - In dev, you can pass `debugIso` to freeze "today" for testing.
 * - Internally checks once per minute, but only updates state when the day flips.
 * - Also re-checks when the app returns to foreground.
 */
export default function useTodayIso(debugIso = null) {
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

        // Check once per minute (lightweight) but only updates when day changes.
        const intervalId = setInterval(tick, 60 * 1000);

        const sub = AppState.addEventListener("change", (state) => {
            if (state === "active") tick();
        });

        return () => {
            clearInterval(intervalId);
            sub.remove();
        };
    }, []);

    return todayIso;
}
