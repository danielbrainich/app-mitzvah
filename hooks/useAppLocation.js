// hooks/useAppLocation.js
import * as Location from "expo-location";
import { useCallback, useEffect, useState } from "react";

export default function useAppLocation() {
    const [status, setStatus] = useState("unknown"); // "granted" | "denied" | "undetermined" | "unknown"
    const [location, setLocation] = useState(null);

    const refresh = useCallback(async () => {
        const perm = await Location.getForegroundPermissionsAsync();
        setStatus(perm.status); // "granted" | "denied" | "undetermined"

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

    useEffect(() => {
        refresh();
    }, [refresh]);

    return { status, location, refresh, requestPermission };
}
