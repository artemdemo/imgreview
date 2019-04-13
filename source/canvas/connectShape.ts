/* eslint-disable import/prefer-default-export */

import store from '../store';
import { TReduxState } from '../reducers';
import { cursorTypes } from '../model/canvas/canvasConst';
import { blurShapes, addArrow } from '../model/shapes/shapesActions';
import { setCursor } from '../model/canvas/canvasActions';
import Arrow from './Arrow/Arrow';

/**
 * Connect Arrow to the stage.
 * If arrow provided - it will use provided instance,
 * if not - will create new one.
 * @param arrow {Arrow}
 */
export const connectArrow = (arrow?: Arrow) => {
    const { canvas, shapes } = <TReduxState> store.getState();
    const _arrow = arrow || new Arrow({
        stroke: shapes.strokeColor,
        strokeWidth: shapes.strokeWidth,
    });
    _arrow.addToStage(canvas.stage);
    _arrow.on('click', arrowInstance => store.dispatch(blurShapes(arrowInstance)));
    _arrow.on('dragstart', arrowInstance => store.dispatch(blurShapes(arrowInstance)));
    _arrow.on('mouseover', () => store.dispatch(setCursor(cursorTypes.move)));
    _arrow.on('mouseout', () => store.dispatch(setCursor(cursorTypes.auto)));
    _arrow.onAnchor('mouseover', () => store.dispatch(setCursor(cursorTypes.pointer)));
    _arrow.onAnchor('mouseout', () => store.dispatch(setCursor(cursorTypes.auto)));
    store.dispatch(addArrow(_arrow));
};
