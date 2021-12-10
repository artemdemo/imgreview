import Konva from 'konva';
import { handleActions } from 'redux-actions';
import * as stageActions from './stageActions';

export type TStateStage = {
  instance: Konva.Stage | null;
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
  },
  initState
);
