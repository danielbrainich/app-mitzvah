import * as actionTypes from "../actions.js";

const initialState = {
    hebrewDate: false,
    minorFasts: true,
    rosheiChodesh: true,
    modernHolidays: true,

    // Times (null means "not set")
    candleLightingTime: null,
    havdalahTime: null,

    // Toggles (explicit defaults to avoid undefined)
    candleLightingToggle: true,
    havdalahTimeToggle: true,
};

const settingsReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.TOGGLE_HEBREW_DATE:
            return { ...state, hebrewDate: !state.hebrewDate };
        case actionTypes.TOGGLE_MINOR_FASTS:
            return { ...state, minorFasts: !state.minorFasts };

        case actionTypes.TOGGLE_ROSHEI_CHODESH:
            return { ...state, rosheiChodesh: !state.rosheiChodesh };

        case actionTypes.TOGGLE_MODERN_HOLIDAYS:
            return { ...state, modernHolidays: !state.modernHolidays };

        case actionTypes.SET_CANDLE_LIGHTING_TIME:
            return { ...state, candleLightingTime: action.payload };

        case actionTypes.SET_HAVDALAH_TIME:
            return { ...state, havdalahTime: action.payload };

        case actionTypes.SET_CANDLE_LIGHTING_TOGGLE:
            return { ...state, candleLightingToggle: action.payload };

        case actionTypes.SET_HAVDALAH_TIME_TOGGLE:
            return { ...state, havdalahTimeToggle: action.payload };

        default:
            return state;
    }
};

export default settingsReducer;
