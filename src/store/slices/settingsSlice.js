import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    minorFasts: true,
    rosheiChodesh: true,
    modernHolidays: true,
    candleLightingTime: 18,
    havdalahTime: 42,
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
    setCandleLightingTime,
    setHavdalahTime,
    setCandleLightingToggle,
    setHavdalahTimeToggle,
} = settingsSlice.actions;

export default settingsSlice.reducer;
