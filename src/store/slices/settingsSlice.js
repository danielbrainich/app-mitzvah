import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    minorFasts: true,
    rosheiChodesh: true,
    modernHolidays: true,
    candleLightingTime: null,
    havdalahTime: null,
    candleLightingToggle: true,
    havdalahTimeToggle: true,
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
        setCandleLightingTime: (state, action) => {
            state.candleLightingTime = action.payload ?? null;
        },
        setHavdalahTime: (state, action) => {
            state.havdalahTime = action.payload ?? null;
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
    setCandleLightingTime,
    setHavdalahTime,
    setCandleLightingToggle,
    setHavdalahTimeToggle,
} = settingsSlice.actions;

export default settingsSlice.reducer;
