import * as menuActions from './menuActions';
import * as canvasApi from '../../../srcCanvas/api/api-types';
import {
  getDefaultStrokeColor,
  getDefaultFillColor,
} from '../../services/utils';
import { GenericState, Reducer } from '../combineReducers';

export interface MenuState extends GenericState {
  strokeColor: string;
  fillColor: string;
  selectedShapeStrokeColor: string | null;
  strokeWidth: number;
  fontSize: number;
  menuHeight: number;
  openSubmenu: string;
  selectedShapeToAdd: canvasApi.EShapeTypes | null;
}

export const menuInitialState: MenuState = {
  strokeColor: getDefaultStrokeColor(),
  fillColor: getDefaultFillColor(),
  selectedShapeStrokeColor: null,
  strokeWidth: 3,
  fontSize: 18,
  menuHeight: 38,
  openSubmenu: '',
  selectedShapeToAdd: null,
};

export const menuReducer: Reducer<MenuState> = (
  state = menuInitialState,
  action,
) => {
  switch (action.type) {
    case `${menuActions.setMenuHeight}`:
      return {
        ...state,
        menuHeight: action.payload,
      };
    case `${menuActions.setStrokeWidth}`:
      return {
        ...state,
        strokeWidth: action.payload,
      };
    case `${menuActions.setStrokeColor}`:
      return {
        ...state,
        strokeColor: action.payload,
      };
    case `${menuActions.setFillColor}`:
      return {
        ...state,
        fillColor: action.payload,
      };
    case `${menuActions.setFontSize}`:
      return {
        ...state,
        fontSize: action.payload,
      };
    case `${menuActions.toggleSubmenu}`:
      return {
        ...state,
        openSubmenu: action.payload,
      };
    case `${menuActions.setShapeToAdd}`:
      return {
        ...state,
        selectedShapeToAdd: action.payload || null,
      };
    default:
      return state;
  }
};
