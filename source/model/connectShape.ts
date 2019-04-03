/* eslint-disable import/prefer-default-export */

import store from '../store';
import { TReduxState } from '../reducers';
import { cursorTypes } from './canvas/canvasConst';
import { blurShapes, addArrow } from './shapes/shapesActions';
import { setCursor } from './canvas/canvasActions';
import Arrow from '../canvas/Arrow/Arrow';

export const connectArrow = () => {
    const { canvas, shapes } = <TReduxState> store.getState();
    const arrow = new Arrow({
        stroke: shapes.stroke,
        strokeWidth: shapes.strokeWidth,
    });
    arrow.addToStage(canvas.stage);
    arrow.on('click', arrowInstance => store.dispatch(blurShapes(arrowInstance)));
    arrow.on('dragstart', arrowInstance => store.dispatch(blurShapes(arrowInstance)));
    arrow.on('mouseover', () => store.dispatch(setCursor(cursorTypes.move)));
    arrow.on('mouseout', () => store.dispatch(setCursor(cursorTypes.auto)));
    arrow.onAnchor('mouseover', () => store.dispatch(setCursor(cursorTypes.pointer)));
    arrow.onAnchor('mouseout', () => store.dispatch(setCursor(cursorTypes.auto)));
    store.dispatch(addArrow(arrow));
};
