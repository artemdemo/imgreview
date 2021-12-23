import { createAction } from 'redux-actions';
import { SaveCanvas } from '../../CanvasEl/SaveCanvas';
import { BoundariesRect } from 'konva';

export const setSaveCanvas = createAction<SaveCanvas>('SET_SAVE_CANVAS');
export type TSaveCanvas = {
  canvas: HTMLCanvasElement;
  name: string;
  contentRect: BoundariesRect;
};
export const saveCanvas = createAction<TSaveCanvas>('SAVE_CANVAS');
