import * as actionTypes from "../actions.js";

const initialState = {
    dateDisplay: "gregorian",
    minorFasts: false,
    rosheiChodesh: false,
    modernHolidays: false,
    candleLightingTime: null,
    havdalahTime: null,
};

const settingsReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_DATE_DISPLAY:
            return {
                ...state,
                dateDisplay: action.payload,
            };
        case actionTypes.TOGGLE_MINOR_FASTS:
            return {
                ...state,
                minorFasts: !state.minorFasts,
            };
        case actionTypes.TOGGLE_ROSHEI_CHODESH:
            return {
                ...state,
                rosheiChodesh: !state.rosheiChodesh,
            };
        case actionTypes.TOGGLE_MODERN_HOLIDAYS:
            return {
                ...state,
                modernHolidays: !state.modernHolidays,
            };
        case actionTypes.SET_CANDLE_LIGHTING_TIME:
            return {
                ...state,
                candleLightingTime: action.payload,
            };
        case actionTypes.SET_HAVDALAH_TIME:
            return {
                ...state,
                havdalahTime: action.payload,
            };
        case actionTypes.SET_CANDLE_LIGHTING_TOGGLE:
            return {
                ...state,
                candleLightingToggle: action.payload,
            };
        case actionTypes.SET_HAVDALAH_TIME_TOGGLE:
            return {
                ...state,
                havdalahTimeToggle: action.payload,
            };
        default:
            return state;
    }
};

export default settingsReducer;
