import {
    SET_DATE_DISPLAY,
    TOGGLE_MINOR_FASTS,
    TOGGLE_ROSHEI_CHODESH,
    TOGGLE_MODERN_HOLIDAYS,
} from "../actions";

const initialState = {
    dateDisplay: "gregorian",
    minorFasts: true,
    rosheiChodesh: true,
    modernHolidays: true,
};

const settingsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_DATE_DISPLAY:
            return { ...state, dateDisplay: action.payload };
        case TOGGLE_MINOR_FASTS:
            return { ...state, minorFasts: !state.minorFasts };
        case TOGGLE_ROSHEI_CHODESH:
            return { ...state, rosheiChodesh: !state.rosheiChodesh };
        case TOGGLE_MODERN_HOLIDAYS:
            return { ...state, modernHolidays: !state.modernHolidays };
        default:
            return state;
    }
};

export default settingsReducer;
