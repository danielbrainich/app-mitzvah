import { useMemo, useCallback } from "react";
import { useDispatch } from "react-redux";
import { LayoutAnimation } from "react-native";
import {
    setCandleLightingTime,
    setHavdalahTime,
    setCandleLightingToggle,
    setHavdalahTimeToggle,
} from "../store/slices/settingsSlice";

const DEFAULT_CANDLE = 18;
const DEFAULT_HAVDALAH = 42;

export function useShabbatSettings(settings) {
    const dispatch = useDispatch();

    const {
        candleLightingTime,
        havdalahTime,
        candleLightingToggle,
        havdalahTimeToggle,
    } = settings;

    const candleValue = useMemo(() => {
        if (!candleLightingToggle) return 0;
        return Number.isFinite(candleLightingTime) ? candleLightingTime : 0;
    }, [candleLightingToggle, candleLightingTime]);

    const havdalahValue = useMemo(() => {
        if (!havdalahTimeToggle) return 0;
        return Number.isFinite(havdalahTime) ? havdalahTime : 0;
    }, [havdalahTimeToggle, havdalahTime]);

    const handleCandleLightingToggle = useCallback(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        const newToggleState = !candleLightingToggle;
        dispatch(setCandleLightingToggle(newToggleState));

        if (newToggleState) {
            const v = Number.isFinite(candleLightingTime)
                ? candleLightingTime
                : 0;
            dispatch(setCandleLightingTime(v));
        } else {
            dispatch(setCandleLightingTime(null));
        }
    }, [dispatch, candleLightingToggle, candleLightingTime]);

    const handleHavdalahTimeToggle = useCallback(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        const newToggleState = !havdalahTimeToggle;
        dispatch(setHavdalahTimeToggle(newToggleState));

        if (newToggleState) {
            const v = Number.isFinite(havdalahTime) ? havdalahTime : 0;
            dispatch(setHavdalahTime(v));
        } else {
            dispatch(setHavdalahTime(null));
        }
    }, [dispatch, havdalahTimeToggle, havdalahTime]);

    const handleCandleValueChange = useCallback(
        (v) => {
            dispatch(setCandleLightingTime(Math.round(v)));
        },
        [dispatch]
    );

    const handleHavdalahValueChange = useCallback(
        (v) => {
            dispatch(setHavdalahTime(Math.round(v)));
        },
        [dispatch]
    );

    return {
        candleValue,
        havdalahValue,
        candleDisplayValue: candleLightingToggle ? candleValue : DEFAULT_CANDLE,
        havdalahDisplayValue: havdalahTimeToggle
            ? havdalahValue
            : DEFAULT_HAVDALAH,
        handleCandleLightingToggle,
        handleHavdalahTimeToggle,
        handleCandleValueChange,
        handleHavdalahValueChange,
    };
}
