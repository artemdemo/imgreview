import { handleActions } from 'redux-actions';
import * as menuActions from './menuActions';

export type TStateMenu = {
    strokeColor: string;
    strokeWidth: number;
    showColorPicker: boolean;
};

const initState: TStateMenu = {
    strokeColor: 'red',
    strokeWidth: 5,
    showColorPicker: false,
};

export default handleActions({
    // Show Color Picker
    //
    [menuActions.showColorPicker]: (state: TStateMenu) => ({
        ...state,
        showColorPicker: true,
    }),
    // Hide Color Picker
    //
    [menuActions.hideColorPicker]: (state: TStateMenu) => ({
        ...state,
        showColorPicker: false,
    }),
    // Set stroke width
    [menuActions.setStrokeWidth]: (state: TStateMenu, action) => ({
        ...state,
        strokeWidth: action.payload,
    }),
    // Set stroke width
    [menuActions.setStrokeColor]: (state: TStateMenu, action) => ({
        ...state,
        strokeColor: action.payload,
    }),
}, initState);
