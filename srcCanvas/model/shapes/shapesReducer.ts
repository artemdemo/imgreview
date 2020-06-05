import Konva from 'konva';
import { handleActions } from 'redux-actions';
import * as shapesActions from './shapesActions';
import { ECursorTypes } from './shapesTypes';
import Arrow from '../../Arrow/Arrow';
import Text from '../../Text/Text';
import * as api from '../../api';
import Rect from "../../Rect/Rect";
import SelectRect from "../../Select/SelectRect";

export type TStateShapes = {
    cursor: ECursorTypes;
    layer: Konva.Layer,
    list: (Arrow|Text)[];
};

const initState: TStateShapes = {
    cursor: ECursorTypes.AUTO,
    layer: new Konva.Layer(),
    list: [],
};

export default handleActions({
    // Add Shape
    //
    [shapesActions.addShape]: (state: TStateShapes, action) => {
        api.shapeAdded(action.payload);
        return {
            ...state,
            list: [
                ...state.list,
                action.payload,
            ],
        };
    },
    // Delete all Shapes
    //
    [shapesActions.deleteAllShapes]: (state: TStateShapes) => {
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
        api.shapesBlurred(action.payload);
        return state;
    },
    // Delete Shape
    //
    [shapesActions.deleteShape]: (state: TStateShapes, action) => {
        const shape = state.list.find(shape => shape === action.payload);
        if (shape) {
            shape.destroy();
        }
        return {
            ...state,
            list: state.list.filter(shape => shape !== action.payload),
        };
    },
    // Delete Active Shapes
    //
    [shapesActions.deleteActiveShapes]: (state: TStateShapes) => {
        const selectedShape = state.list.find(shape => shape.isSelected());
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
        const selectedShape = state.list.find(shape => shape.isSelected());
        const isArrow = selectedShape instanceof Arrow;
        const isRect = selectedShape instanceof Rect;
        if (isArrow || isRect) {
            (<Arrow|Rect>selectedShape).setStrokeColor(action.payload);
        } else if (selectedShape instanceof Text) {
            selectedShape.setFillColor(action.payload);
        } else {
            console.error('Can\'t set stroke color for the selected shape');
            console.log(selectedShape);
        }
        return state;
    },
    // Set Stroke Width
    //
    [shapesActions.setStrokeWidthToActiveShape]: (state: TStateShapes, action) => {
        const selectedShape = state.list.find(shape => shape.isSelected());
        const isArrow = selectedShape instanceof Arrow;
        const isRect = selectedShape instanceof Rect && !(selectedShape instanceof SelectRect);
        if (isArrow || isRect) {
            (<Arrow|Rect>selectedShape).setStrokeWidth(action.payload);
        } else {
            console.error('Can\'t set stroke width for the selected shape');
            console.log(selectedShape);
        }
        return state;
    },
    // Set Font Size
    //
    [shapesActions.setFontSizeToActiveShape]: (state: TStateShapes, action) => {
        const selectedShape = state.list.find(shape => shape.isSelected());
        const isText = selectedShape instanceof Text;
        if (isText) {
            (<Text>selectedShape).setFontSize(action.payload);
        } else {
            console.error('Can\'t set font size for the selected shape');
            console.log(selectedShape);
        }
        return state;
    },
    // Scale Shapes
    //
    [shapesActions.scaleShapes]: (state: TStateShapes, action) => {
        if (action.payload) {
            state.list.forEach(shape => shape.scale(action.payload));
        }
        return state;
    },
}, initState);
