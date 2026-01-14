// hooks/useAppLocation.js
import * as Location from "expo-location";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";

export default function useAppLocation() {
    const [status, setStatus] = useState("unknown"); // granted | denied | undetermined | unknown
    const [location, setLocation] = useState(null);

    // Prevent spamming prompts on repeated "active" transitions
    const promptedThisActiveRef = useRef(false);

    const updateLocationIfGranted = useCallback(async () => {
        const pos = await Location.getCurrentPositionAsync({});
        setLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            elevation: pos.coords.altitude ?? null,
        });
    }, []);

    const refresh = useCallback(async () => {
        const perm = await Location.getForegroundPermissionsAsync();
        setStatus(perm.status);

        if (perm.status === "granted") {
            await updateLocationIfGranted();
        } else {
            setLocation(null);
        }

        return perm.status;
    }, [updateLocationIfGranted]);

    const requestPermission = useCallback(async () => {
        const perm = await Location.requestForegroundPermissionsAsync();
        setStatus(perm.status);

        if (perm.status === "granted") {
            await updateLocationIfGranted();
        } else {
            setLocation(null);
        }

        return perm.status;
    }, [updateLocationIfGranted]);

    // initial load
    useEffect(() => {
        refresh();
    }, [refresh]);

    // ✅ When returning from Settings, iOS won't prompt unless we REQUEST.
    useEffect(() => {
        const sub = AppState.addEventListener("change", async (nextState) => {
            if (nextState !== "active") return;

            // new active session -> allow one prompt again
            promptedThisActiveRef.current = false;

            const perm = await Location.getForegroundPermissionsAsync();
            setStatus(perm.status);

            if (perm.status === "granted") {
                await updateLocationIfGranted();
                return;
            }

            setLocation(null);

            // If user set "Ask Next Time", iOS typically behaves like "undetermined"
            // until you request again. So request once automatically on return.
            if (!promptedThisActiveRef.current) {
                promptedThisActiveRef.current = true;
                await requestPermission();
            }
        });

        return () => sub.remove();
    }, [requestPermission, updateLocationIfGranted]);

    return { status, location, refresh, requestPermission };
}
