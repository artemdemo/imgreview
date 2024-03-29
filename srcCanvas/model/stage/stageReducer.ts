import { handleActions } from 'redux-actions';
import * as stageActions from './stageActions';
import Stage from '../../CanvasEl/Stage';

export type TStateStage = {
  instance: Stage | null;
  isDraggable: boolean;
  ratioShiftIsActive: boolean;
};

const initState: TStateStage = {
  instance: null,
  isDraggable: false,
  ratioShiftIsActive: false,
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
    [`${stageActions.setStageDraggable}`]: (state, acton) => {
      const isDraggable: boolean = acton.payload;
      state.instance?.draggable(isDraggable);
      return {
        ...state,
        isDraggable,
      };
    },
    [`${stageActions.setRatioShift}`]: (state, acton) => {
      const ratioShiftIsActive: boolean = acton.payload;
      state.instance?.draggable(ratioShiftIsActive);
      return {
        ...state,
        ratioShiftIsActive,
      };
    },
  },
  initState,
);
