import * as Location from "expo-location";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";

export default function useAppLocation() {
    const [status, setStatus] = useState("unknown"); // "granted" | "denied" | "undetermined" | "unknown"
    const [location, setLocation] = useState(null);

    // Prevent overlapping refresh calls
    const inFlightRef = useRef(false);

    const refresh = useCallback(async () => {
        if (inFlightRef.current) return status;
        inFlightRef.current = true;

        try {
            const perm = await Location.getForegroundPermissionsAsync();
            setStatus(perm.status);

            if (perm.status === "granted") {
                const pos = await Location.getCurrentPositionAsync({});
                setLocation({
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                    elevation: pos.coords.altitude ?? null,
                });
            } else {
                setLocation(null);
            }

            return perm.status;
        } finally {
            inFlightRef.current = false;
        }
    }, [status]);

    const requestPermission = useCallback(async () => {
        const perm = await Location.requestForegroundPermissionsAsync();
        setStatus(perm.status);

        if (perm.status === "granted") {
            const pos = await Location.getCurrentPositionAsync({});
            setLocation({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
                elevation: pos.coords.altitude ?? null,
            });
        } else {
            setLocation(null);
        }

        return perm.status;
    }, []);

    // Initial load
    useEffect(() => {
        refresh();
    }, [refresh]);

    // When returning from Settings: always re-check.
    const AUTO_REQUEST_ON_ACTIVE = true;

    useEffect(() => {
        const sub = AppState.addEventListener("change", async (nextState) => {
            if (nextState !== "active") return;

            const st = await refresh();

            // if iOS is set to "Ask Next Time", coming back to the app triggers a prompt.
            if (AUTO_REQUEST_ON_ACTIVE && st !== "granted") {
                // requestForegroundPermissionsAsync is what triggers the prompt
                await requestPermission();
            }
        });

        return () => sub.remove();
    }, [refresh, requestPermission]);

    return { status, location, refresh, requestPermission };
}
