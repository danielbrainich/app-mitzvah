import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // Holiday toggles - all start ON
    minorFasts: true,
    rosheiChodesh: true,
    modernHolidays: true,
    specialShabbatot: true,

    // Shabbat time values (used when toggles are ON)
    candleLightingTime: 18,
    havdalahTime: 42,

    // Shabbat toggles - both start OFF (use default times)
    candleLightingToggle: false,
    havdalahTimeToggle: false,
};

const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        toggleMinorFasts: (state) => {
            state.minorFasts = !state.minorFasts;
        },
        toggleRosheiChodesh: (state) => {
            state.rosheiChodesh = !state.rosheiChodesh;
        },
        toggleModernHolidays: (state) => {
            state.modernHolidays = !state.modernHolidays;
        },
        toggleSpecialShabbatot: (state) => {
            state.specialShabbatot = !state.specialShabbatot;
        },
        setCandleLightingTime: (state, action) => {
            state.candleLightingTime = action.payload;
        },
        setHavdalahTime: (state, action) => {
            state.havdalahTime = action.payload;
        },
        setCandleLightingToggle: (state, action) => {
            state.candleLightingToggle = action.payload;
        },
        setHavdalahTimeToggle: (state, action) => {
            state.havdalahTimeToggle = action.payload;
        },
    },
});

export const {
    toggleMinorFasts,
    toggleRosheiChodesh,
    toggleModernHolidays,
    toggleSpecialShabbatot,
    setCandleLightingTime,
    setHavdalahTime,
    setCandleLightingToggle,
    setHavdalahTimeToggle,
} = settingsSlice.actions;

export default settingsSlice.reducer;
