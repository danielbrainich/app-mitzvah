// Action types
export const SET_DATE_DISPLAY = "SET_DATE_DISPLAY";
export const TOGGLE_MINOR_FASTS = "TOGGLE_MINOR_FASTS";
export const TOGGLE_ROSHEI_CHODESH = "TOGGLE_ROSHEI_CHODESH";
export const TOGGLE_MODERN_HOLIDAYS = "TOGGLE_MODERN_HOLIDAYS";
export const SET_CANDLE_LIGHTING_TIME = "SET_CANDLE_LIGHTING_TIME";
export const SET_HAVDALAH_TIME = "SET_HAVDALAH_TIME";
export const SET_CANDLE_LIGHTING_TOGGLE = "SET_CANDLE_LIGHTING_TOGGLE";
export const SET_HAVDALAH_TIME_TOGGLE = "SET_HAVDALAH_TIME_TOGGLE";

// Action creators
export const setDateDisplay = (dateDisplay) => ({
    type: SET_DATE_DISPLAY,
    payload: dateDisplay,
});

export const toggleMinorFasts = () => ({ type: TOGGLE_MINOR_FASTS });

export const toggleRosheiChodesh = () => ({ type: TOGGLE_ROSHEI_CHODESH });

export const toggleModernHolidays = () => ({ type: TOGGLE_MODERN_HOLIDAYS });

export const setCandleLightingTime = (time) => ({
    type: SET_CANDLE_LIGHTING_TIME,
    payload: time ?? null,
});

export const setHavdalahTime = (time) => ({
    type: SET_HAVDALAH_TIME,
    payload: time ?? null,
});

export const setCandleLightingToggle = (toggle) => ({
    type: SET_CANDLE_LIGHTING_TOGGLE,
    payload: toggle,
});

export const setHavdalahTimeToggle = (toggle) => ({
    type: SET_HAVDALAH_TIME_TOGGLE,
    payload: toggle,
});
