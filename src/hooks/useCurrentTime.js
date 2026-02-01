import { useState, useEffect, useMemo } from "react";
import { parseLocalIso } from "../utils/datetime";
import { getDevOverrideTime } from "./useTodayIsoDay";

function formatIsoLocal(d) {
    if (!(d instanceof Date) || isNaN(d.getTime())) {
        return "";
    }
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

async function localTimeFromIso(iso) {
    const d = parseLocalIso(iso);
    if (!d) return null;

    // Check if there's a time override
    const overrideTime = await getDevOverrideTime();
    if (overrideTime) {
        const overrideDate = new Date(overrideTime);
        return new Date(
            d.getFullYear(),
            d.getMonth(),
            d.getDate(),
            overrideDate.getHours(),
            overrideDate.getMinutes(),
            0,
            0
        );
    }

    // Default to noon
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0, 0);
}

export function useCurrentTime(todayIso) {
    const realIso = useMemo(() => formatIsoLocal(new Date()), []);
    const isDevOverride = todayIso && todayIso !== realIso;

    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        if (isDevOverride) {
            // Dev mode: freeze at override time
            localTimeFromIso(todayIso).then((frozen) => {
                if (frozen) {
                    setNow(frozen);
                }
            });

            // Poll for changes to dev override
            const interval = setInterval(() => {
                localTimeFromIso(todayIso).then((frozen) => {
                    if (frozen && frozen.getTime() !== now.getTime()) {
                        setNow(frozen);
                    }
                });
            }, 1000);

            return () => clearInterval(interval);
        } else {
            // Real mode: update every second
            setNow(new Date());
            const interval = setInterval(() => {
                setNow(new Date());
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [isDevOverride, todayIso]);

    return { now, isDevOverride };
}
