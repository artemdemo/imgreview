import Konva from 'konva';
import { createAction } from 'redux-actions';
import { SaveStage } from '../../CanvasEl/SaveStage';
import { BoundariesRect } from '../../custom';

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
