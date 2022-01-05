import { handleActions } from 'redux-actions';
import * as saveCanvasActions from './saveCanvasActions';
import { SaveStage } from '../../CanvasEl/SaveStage';
import { TCopyStage, TSaveStage } from './saveCanvasActions';

export type TSaveCanvasStage = {
  instance: SaveStage | null;
};

const initState: TSaveCanvasStage = {
  instance: null,
};

export default handleActions<TSaveCanvasStage, any>(
  {
    [`${saveCanvasActions.setSaveStage}`]: (state, action) => ({
      ...state,
      instance: action.payload,
    }),
    [`${saveCanvasActions.saveStage}`]: (state, action) => {
      const data: TSaveStage = action.payload;
      if (!state.instance) {
        throw new Error('SaveStage is not defined');
      }
      state.instance.saveFromLayer(data.layer, data.name, data.contentRect);
      return state;
    },
    [`${saveCanvasActions.copyStage}`]: (state, action) => {
      const data: TCopyStage = action.payload;
      if (!state.instance) {
        throw new Error('SaveStage is not defined');
      }
      state.instance.copyFromLayer(data.layer, data.contentRect);
      return state;
    },
  },
  initState,
);
