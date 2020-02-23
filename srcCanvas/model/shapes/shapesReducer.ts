import Konva from 'konva';
import { handleActions } from 'redux-actions';
import * as shapesActions from './shapesActions';
import GeometricShape from '../../Shape/GeometricShape';
import { ECursorTypes } from './shapesTypes';

export type TStateShapes = {
    cursor: ECursorTypes;
    layer: Konva.Layer,
    list: GeometricShape[];
};

const initState: TStateShapes = {
    cursor: ECursorTypes.AUTO,
    layer: new Konva.Layer(),
    list: [],
};

export default handleActions({
    // Add Shape
    //
    [shapesActions.addShape]: (state: TStateShapes, action) => ({
        ...state,
        list: [
            ...state.list,
            action.payload,
        ],
    }),
    // Delete all Shapes
    //
    [shapesActions.deleteAllShape]: (state: TStateShapes) => {
        state.list.forEach(shape => shape.destroy());
        return {
            ...state,
            list: [],
        }
    },
    // Blur Shapes
    //
    [shapesActions.blurShapes]: (state: TStateShapes, action) => {
        state.list.forEach((shape) => {
            // Blur all shapes that have `blur`
            // and are not an exception.
            // I need `exceptShape` in order to not blur shape that user clicked on
            // it's useful in case there are number of shapes on the stage and user just clicked on another one
            if (shape !== action.payload) {
                shape.blur();
            }
        });
        return state;
    },
    // Delete Shape
    //
    [shapesActions.deleteActiveShape]: (state: TStateShapes) => {
        const selectedShape = state.list.find(shape => shape.isSelected);
        if (selectedShape) {
            selectedShape.destroy();
        }
        return {
            ...state,
            list: state.list.filter(shape => shape !== selectedShape),
        };
    },
    // Set Cursor
    //
    [shapesActions.setCursor]: (state: TStateShapes, action) => {
        return {
            ...state,
            cursor: action.payload,
        };
    },
    // Set Stroke Color
    //
    [shapesActions.setStrokeColorToActiveShape]: (state: TStateShapes, action) => {
        const selectedShape = state.list.find(shape => shape.isSelected);
        if (selectedShape) {
            selectedShape.setStrokeColor(action.payload);
        }
        return state;
    },
    // Set Stroke Width
    //
    [shapesActions.setStrokeWidthToActiveShape]: (state: TStateShapes, action) => {
        const selectedShape = state.list.find(shape => shape.isSelected);
        if (selectedShape) {
            selectedShape.setStrokeWidth(action.payload);
        }
        return state;
    },
    // Scale Shapes
    //
    [shapesActions.scaleShapes]: (state: TStateShapes, action) => {
        state.list.forEach(shape => shape.scale(action.payload));
        return state;
    },
}, initState);
