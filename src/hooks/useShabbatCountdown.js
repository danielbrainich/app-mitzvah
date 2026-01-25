import { useState, useEffect, useMemo } from "react";
import { parseLocalIso } from "../utils/datetime";

function formatIsoLocal(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

function localNoonFromIso(iso) {
    const d = parseLocalIso(iso);
    if (!d) return null;
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0, 0);
}

export function useShabbatCountdown(todayIso) {
    const realIso = useMemo(() => formatIsoLocal(new Date()), []);
    const isDevOverride = todayIso !== realIso;
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        if (isDevOverride) {
            const frozen = localNoonFromIso(todayIso) ?? new Date();
            setNow(frozen);
            return;
        }
        // Update every 60 seconds since countdown only shows minutes
        const interval = setInterval(() => setNow(new Date()), 60000);
        return () => clearInterval(interval);
    }, [isDevOverride, todayIso]);

    return { now, isDevOverride };
}
