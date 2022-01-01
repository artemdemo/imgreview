import Konva, { BoundariesRect, TPos } from 'konva';
import { createAction } from 'redux-actions';
import { SaveStage } from '../../CanvasEl/SaveStage';

export const setSaveStage = createAction<SaveStage>('SET_SAVE_STAGE');
export type TSaveStage = {
  layer: Konva.Layer;
  name: string;
  contentRect: BoundariesRect;
};
export const saveStage = createAction<TSaveStage>('SAVE_STAGE');
export type TCopyStage = {
  layer: Konva.Layer;
  contentRect: BoundariesRect;
};
export const copyStage = createAction<TCopyStage>('COPY_STAGE');
