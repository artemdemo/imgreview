import { handleActions } from 'redux-actions';
import * as stageActions from './stageActions';
import { setStageDraggable } from './stageActions';
import Stage from '../../Stage/Stage';

export type TStateStage = {
  instance: Stage | null;
};

const initState: TStateStage = {
  instance: null,
};

export default handleActions<TStateStage, any>(
  {
    // Stage will be set by CanvasEl on initialization
    [`${stageActions.setStage}`]: (state, action) => ({
      ...state,
      instance: action.payload,
    }),
    [`${stageActions.setStageSize}`]: (state, action) => {
      const { width, height } = action.payload;
      state.instance?.setAttrs({
        width,
        height,
      });
      return state;
    },
    [`${setStageDraggable}`]: (state, acton) => {
      state.instance?.draggable(acton.payload);
      return state;
    },
  },
  initState
);
