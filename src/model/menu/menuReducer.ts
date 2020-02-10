import { handleActions } from 'redux-actions';
import * as menuActions from './menuActions';

export type TStateMenu = {
    strokeColor: string;
    selectedShapeStrokeColor: string|null;
    strokeWidth: number;
    showColorPicker: boolean;
    openSubmenu: string;
};

const initState: TStateMenu = {
    strokeColor: 'red',
    selectedShapeStrokeColor: null,
    strokeWidth: 5,
    showColorPicker: false,
    openSubmenu: '',
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
    // Set stroke color
    [menuActions.setStrokeColor]: (state: TStateMenu, action) => ({
        ...state,
        strokeColor: action.payload,
    }),
    // Toggle submenu
    [menuActions.toggleSubmenu]: (state: TStateMenu, action) => ({
        ...state,
        openSubmenu: action.payload,
    }),
}, initState);
