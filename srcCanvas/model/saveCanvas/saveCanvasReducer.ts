import { handleActions } from 'redux-actions';
import * as saveCanvasActions from './saveCanvasActions';
import { SaveCanvas } from '../../CanvasEl/SaveCanvas';
import { TSaveCanvas } from './saveCanvasActions';

export type TSaveCanvasStage = {
  instance: SaveCanvas | null;
};

const initState: TSaveCanvasStage = {
  instance: null,
};

export default handleActions<TSaveCanvasStage, any>(
  {
    [`${saveCanvasActions.setSaveCanvas}`]: (state, action) => ({
      ...state,
      instance: action.payload,
    }),
    [`${saveCanvasActions.saveCanvas}`]: (state, action) => {
      const data: TSaveCanvas = action.payload;
      if (!state.instance) {
        throw new Error('SaveCanvas is not defined');
      }
      state.instance.saveFromCanvas(data.canvas, data.name, data.contentRect);
      return state;
    },
  },
  initState
);
