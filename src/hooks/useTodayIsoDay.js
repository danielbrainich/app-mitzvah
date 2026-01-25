// hooks/useTodayIsoDay.js
import { useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "DEV_OVERRIDE_ISO_DATE";

// simple in-memory pubsub so hooks update immediately
const listeners = new Set();
function emit() {
    for (const fn of listeners) fn();
}

/**
 * Get the persisted dev override ISO date ("YYYY-MM-DD") or null
 */
export async function getDevOverrideIsoDate() {
    try {
        const v = await AsyncStorage.getItem(STORAGE_KEY);
        return v || null;
    } catch {
        return null;
    }
}

/**
 * Set dev override ISO date ("YYYY-MM-DD") or clear with null
 * This triggers subscribed hooks to update immediately.
 */
export async function setDevOverrideIsoDate(isoOrNull) {
    try {
        if (!isoOrNull) {
            await AsyncStorage.removeItem(STORAGE_KEY);
        } else {
            await AsyncStorage.setItem(STORAGE_KEY, isoOrNull);
        }
    } finally {
        emit(); // important: makes the app re-render immediately
    }
}

/**
 * Subscribe to override changes (internal)
 */
function subscribe(cb) {
    listeners.add(cb);
    return () => listeners.delete(cb);
}

function formatIsoLocal(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

/**
 * Primary hook used by AppNavigator.
 *
 * Priority:
 * 1) Dev override (from TopBar picker)
 * 2) real device date (local)
 */
export default function useTodayIsoDay(debugIso) {
    const [overrideIso, setOverrideIso] = useState(null);

    // load once + subscribe for immediate updates
    useEffect(() => {
        let mounted = true;

        const load = async () => {
            const v = await getDevOverrideIsoDate();
            if (mounted) setOverrideIso(v);
        };

        load();

        const unsub = subscribe(() => {
            load(); // reload from storage whenever TopBar sets/resets
        });

        return () => {
            mounted = false;
            unsub();
        };
    }, []);

    // if no override/debug, still tick over at midnight so "today" updates
    useEffect(() => {
        if (overrideIso || debugIso) return;

        const scheduleMidnightTick = () => {
            const now = new Date();
            const midnight = new Date(now);
            midnight.setDate(now.getDate() + 1);
            midnight.setHours(0, 0, 1, 0);
            const ms = midnight.getTime() - now.getTime();

            return setTimeout(() => {
                // force rerender by briefly setting state to same value (safe)
                setOverrideIso((v) => v);
                timeoutId = scheduleMidnightTick();
            }, ms);
        };

        let timeoutId = scheduleMidnightTick();
        return () => clearTimeout(timeoutId);
    }, [overrideIso, debugIso]);

    const todayIso = useMemo(() => {
        if (overrideIso) return overrideIso;
        if (debugIso) return debugIso;
        return formatIsoLocal(new Date());
    }, [overrideIso, debugIso]);

    return todayIso;
}
