import { handleActions } from 'redux-actions';
import * as menuActions from './menuActions';

export type TStateMenu = {
    showColorPicker: boolean;
};

const initState: TStateMenu = {
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
}, initState);
