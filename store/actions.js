export const SET_DATE_DISPLAY = 'SET_DATE_DISPLAY';
export const TOGGLE_MINOR_FASTS = 'TOGGLE_MINOR_FASTS';
export const TOGGLE_ROSHEI_CHODESH = 'TOGGLE_ROSHEI_CHODESH';

export const setDateDisplay = (dateDisplay) => ({
    type: SET_DATE_DISPLAY,
    payload: dateDisplay,
});

export const toggleMinorFasts = () => ({
    type: 'TOGGLE_MINOR_FASTS',
});

export const toggleRosheiChodesh = () => ({
    type: 'TOGGLE_ROSHEI_CHODESH',
});
