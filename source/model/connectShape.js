/* eslint-disable import/prefer-default-export */

import store from '../store';
import { cursorTypes } from './canvas/canvasConst';
import { blurShapes, addArrow } from './shapes/shapesActions';
import { setCursor } from './canvas/canvasActions';

export const connectArrow = (arrow) => {
    const { canvas } = store.getState();
    arrow.addToStage(canvas.stage);
    arrow.on('click', arrowInstance => store.dispatch(blurShapes(arrowInstance)));
    arrow.on('dragstart', arrowInstance => store.dispatch(blurShapes(arrowInstance)));
    arrow.on('mouseover', () => store.dispatch(setCursor(cursorTypes.move)));
    arrow.on('mouseout', () => store.dispatch(setCursor(cursorTypes.auto)));
    arrow.onAnchor('mouseover', () => store.dispatch(setCursor(cursorTypes.pointer)));
    arrow.onAnchor('mouseout', () => store.dispatch(setCursor(cursorTypes.auto)));
    store.dispatch(addArrow(arrow));
};
