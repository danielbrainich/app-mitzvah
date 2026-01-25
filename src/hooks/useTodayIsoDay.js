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
    } catch (err) {
        console.error("Error reading dev override date:", err);
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
            // Basic validation
            if (
                typeof isoOrNull !== "string" ||
                !/^\d{4}-\d{2}-\d{2}$/.test(isoOrNull)
            ) {
                console.error("Invalid ISO date format:", isoOrNull);
                return;
            }
            await AsyncStorage.setItem(STORAGE_KEY, isoOrNull);
        }
    } catch (err) {
        console.error("Error setting dev override date:", err);
    } finally {
        emit(); // important: makes the app re-render immediately
    }
}

/**
 * Subscribe to override changes (internal)
 */
function subscribe(cb) {
    if (typeof cb !== "function") return () => {};
    listeners.add(cb);
    return () => listeners.delete(cb);
}

function formatIsoLocal(d) {
    if (!(d instanceof Date) || isNaN(d.getTime())) {
        return formatIsoLocal(new Date()); // fallback to now
    }
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
 * 2) Debug ISO (for testing)
 * 3) Real device date (local)
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
            if (mounted) load(); // reload from storage whenever TopBar sets/resets
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

            // Safety check: if calculation seems wrong, default to 24 hours
            const safeMs = ms > 0 && ms < 86400000 ? ms : 86400000;

            return setTimeout(() => {
                // force rerender by briefly setting state to trigger useMemo
                setOverrideIso((v) => v);
                timeoutId = scheduleMidnightTick();
            }, safeMs);
        };

        let timeoutId = scheduleMidnightTick();
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [overrideIso, debugIso]);

    const todayIso = useMemo(() => {
        if (overrideIso) return overrideIso;
        if (debugIso) return debugIso;
        return formatIsoLocal(new Date());
    }, [overrideIso, debugIso]);

    return todayIso;
}
