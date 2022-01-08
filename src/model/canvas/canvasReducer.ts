import { GenericState, Reducer } from '../combineReducers';
import * as canvasActions from './canvasActions';
import { CanvasAPI } from '../../../srcCanvas/api/api-types';

export interface CanvasState extends GenericState {
  canvasApi: CanvasAPI | null;
}

export const canvasInitialState: CanvasState = {
  canvasApi: null,
};

export const canvasReducer: Reducer<CanvasState> = (
  state = canvasInitialState,
  action,
) => {
  switch (action.type) {
    case `${canvasActions.setCanvasApi}`:
      return {
        ...state,
        canvasApi: action.payload,
      };
    default:
      return state;
  }
};
