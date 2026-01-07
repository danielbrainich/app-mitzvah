import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AppState } from "react-native";
import * as ExpoLocation from "expo-location";

/**
 * Shared app location hook.
 *
 * Returns:
 * - status: "unknown" | "granted" | "denied"
 * - location: { latitude, longitude, elevation } | null
 * - hasLocation: boolean
 * - refresh(): re-fetch (does not prompt if already decided)
 */
export default function useAppLocation() {
    const [status, setStatus] = useState("unknown");
    const [location, setLocation] = useState(null);
    const mountedRef = useRef(true);

    const refresh = useCallback(async () => {
        try {
            // Don't re-prompt; just check current permission state.
            const { status: perm } =
                await ExpoLocation.getForegroundPermissionsAsync();
            if (!mountedRef.current) return;

            if (perm !== "granted") {
                setStatus(perm === "undetermined" ? "unknown" : "denied");
                setLocation(null);
                return;
            }

            setStatus("granted");

            const pos = await ExpoLocation.getCurrentPositionAsync({});
            if (!mountedRef.current) return;

            setLocation({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
                elevation: pos.coords.altitude,
            });
        } catch (e) {
            if (!mountedRef.current) return;
            setStatus("denied");
            setLocation(null);
            if (__DEV__) console.warn("[Location] refresh failed:", e);
        }
    }, []);

    const requestPermissionAndRefresh = useCallback(async () => {
        try {
            const { status: perm } =
                await ExpoLocation.requestForegroundPermissionsAsync();
            if (!mountedRef.current) return;

            if (perm !== "granted") {
                setStatus("denied");
                setLocation(null);
                return;
            }

            setStatus("granted");
            await refresh();
        } catch (e) {
            if (!mountedRef.current) return;
            setStatus("denied");
            setLocation(null);
            if (__DEV__)
                console.warn("[Location] permission request failed:", e);
        }
    }, [refresh]);

    useEffect(() => {
        mountedRef.current = true;

        // On mount: ask once (so we can actually get a position).
        requestPermissionAndRefresh();

        const sub = AppState.addEventListener("change", (state) => {
            if (state === "active") refresh();
        });

        return () => {
            mountedRef.current = false;
            sub.remove();
        };
    }, [refresh, requestPermissionAndRefresh]);

    const hasLocation = useMemo(
        () => !!location && status === "granted",
        [location, status]
    );

    return { status, location, hasLocation, refresh };
}
