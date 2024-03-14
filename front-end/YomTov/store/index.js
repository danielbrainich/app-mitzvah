import { createStore } from "redux";

const initialState = {
    dateDisplay: "gregorian",
};

function rootReducer(state = initialState, action) {
    switch (action.type) {
        case "SET_DATE_DISPLAY":
            return {
                ...state,
                dateDisplay: action.payload,
            };
        default:
            return state;
    }
}

const store = createStore(rootReducer);

export default store;
