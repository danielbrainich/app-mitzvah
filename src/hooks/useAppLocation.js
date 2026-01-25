import * as Location from "expo-location";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";

export default function useAppLocation() {
    const [status, setStatus] = useState("unknown"); // "granted" | "denied" | "undetermined" | "unknown"
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);

    // Prevent overlapping refresh calls
    const inFlightRef = useRef(false);

    const refresh = useCallback(async () => {
        if (inFlightRef.current) return status;
        inFlightRef.current = true;

        try {
            setError(null);
            const perm = await Location.getForegroundPermissionsAsync();
            setStatus(perm.status);

            if (perm.status === "granted") {
                const pos = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced,
                });

                if (pos?.coords) {
                    setLocation({
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude,
                        elevation: pos.coords.altitude ?? null,
                    });
                }
            } else {
                setLocation(null);
            }

            return perm.status;
        } catch (err) {
            console.error("Error refreshing location:", err);
            setError(err.message || "Failed to get location");
            setStatus("unknown");
            setLocation(null);
            return "unknown";
        } finally {
            inFlightRef.current = false;
        }
    }, [status]);

    const requestPermission = useCallback(async () => {
        try {
            setError(null);
            const perm = await Location.requestForegroundPermissionsAsync();
            setStatus(perm.status);

            if (perm.status === "granted") {
                const pos = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced,
                });

                if (pos?.coords) {
                    setLocation({
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude,
                        elevation: pos.coords.altitude ?? null,
                    });
                }
            } else {
                setLocation(null);
            }

            return perm.status;
        } catch (err) {
            console.error("Error requesting location permission:", err);
            setError(err.message || "Failed to request permission");
            setStatus("unknown");
            setLocation(null);
            return "unknown";
        }
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
                await requestPermission();
            }
        });

        return () => sub?.remove();
    }, [refresh, requestPermission]);

    return { status, location, error, refresh, requestPermission };
}
