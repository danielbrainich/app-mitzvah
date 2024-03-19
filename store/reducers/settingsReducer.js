import {
    SET_DATE_DISPLAY,
    TOGGLE_MINOR_FASTS,
    TOGGLE_ROSHEI_CHODESH,
} from "../actions";

const initialState = {
    dateDisplay: "gregorian",
    minorFasts: false,
    rosheiChodesh: false,
};

const settingsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_DATE_DISPLAY:
            return { ...state, dateDisplay: action.payload };
        case TOGGLE_MINOR_FASTS:
            return { ...state, minorFasts: !state.minorFasts };
        case TOGGLE_ROSHEI_CHODESH:
            return { ...state, rosheiChodesh: !state.rosheiChodesh };
        default:
            return state;
    }
};

export default settingsReducer;
