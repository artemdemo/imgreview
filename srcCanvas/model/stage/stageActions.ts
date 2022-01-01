import { createAction } from 'redux-actions';
import Stage from '../../CanvasEl/Stage';

export const setStage = createAction<Stage>('SET_STAGE');
export const setStageSize =
  createAction<{ width: number; height: number }>('SET_STAGE_SIZE');
export const setStageDraggable = createAction<boolean>('SET_STAGE_DRAGGABLE');
