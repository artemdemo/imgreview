import { handleActions } from 'redux-actions';
import * as menuActions from './menuActions';
import * as canvasApi from '../../../srcCanvas/api';
import { getDefaultStrokeColor } from '../../services/utils';

export type TStateMenu = {
  strokeColor: string;
  selectedShapeStrokeColor: string | null;
  strokeWidth: number;
  fontSize: number;
  showColorPicker: boolean;
  menuHeight: number;
  openSubmenu: string;
  selectedShapeToAdd: canvasApi.EShapeTypes | null;
};

const initState: TStateMenu = {
  strokeColor: getDefaultStrokeColor(),
  selectedShapeStrokeColor: null,
  strokeWidth: 3,
  fontSize: 18,
  showColorPicker: false,
  menuHeight: 0,
  openSubmenu: '',
  selectedShapeToAdd: null,
};

export default handleActions<TStateMenu, any>(
  {
    // Show Color Picker
    [`${menuActions.showColorPicker}`]: (state) => ({
      ...state,
      showColorPicker: true,
    }),
    // Set Menu Height
    [`${menuActions.setMenuHeight}`]: (state, action) => ({
      ...state,
      menuHeight: action.payload,
    }),
    // Hide Color Picker
    [`${menuActions.hideColorPicker}`]: (state) => ({
      ...state,
      showColorPicker: false,
    }),
    // Set stroke width
    [`${menuActions.setStrokeWidth}`]: (state, action) => ({
      ...state,
      strokeWidth: action.payload,
    }),
    // Set stroke color
    [`${menuActions.setStrokeColor}`]: (state, action) => ({
      ...state,
      strokeColor: action.payload,
    }),
    // Set font size
    [`${menuActions.setFontSize}`]: (state, action) => ({
      ...state,
      fontSize: action.payload,
    }),
    // Toggle submenu
    [`${menuActions.toggleSubmenu}`]: (state, action) => ({
      ...state,
      openSubmenu: action.payload,
    }),
    [`${menuActions.setShapeToAdd}`]: (state, action) => ({
      ...state,
      selectedShapeToAdd: action.payload || null,
    }),
  },
  initState
);
