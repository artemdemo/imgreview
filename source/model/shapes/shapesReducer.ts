import { handleActions } from 'redux-actions';
import _get from 'lodash/get';
import * as shapesActions from './shapesActions';

export type TShapes = {
    stroke: string;
    strokeWidth: number;
    showColorPicker: boolean;
    list: any;
    copiedShapes: any;
};

const initState: TShapes = {
    stroke: 'red',
    strokeWidth: 5,
    showColorPicker: false,
    list: [],
    copiedShapes: [],
};

export default handleActions({
    // Add Arrow
    //
    [shapesActions.addArrow]: (state: TShapes, action) => ({
        ...state,
        list: [
            ...state.list,
            action.payload,
        ],
    }),
    // Set Stroke Color
    //
    [shapesActions.setStroke]: (state: TShapes, action) => {
        state.list.forEach((shape) => {
            if (shape.isSelected && shape.setStroke) {
                shape.setStroke(action.payload);
            }
        });
        return {
            ...state,
            stroke: action.payload,
        };
    },
    // Blur Shapes
    //
    [shapesActions.blurShapes]: (state: TShapes, action) => {
        state.list.forEach((shape) => {
            // Blur all shapes that have `clearFocus`
            // and are not an exception.
            // I need `exceptShape` in order to not blur shape that user clicked on
            // it's useful in case there are number of shapes on the stage and user just clicked on another one
            if (shape.clearFocus && shape !== action.payload) {
                shape.clearFocus();
            }
        });
        return state;
    },
    // Delete Shape
    //
    [shapesActions.deleteActiveShape]: (state: TShapes) => {
        const selectedShape = state.list.find(item => _get(item, 'isSelected', false) === true);
        if (selectedShape) {
            selectedShape.destroy();
        }
        return {
            ...state,
            list: state.list.filter(shape => shape !== selectedShape),
        };
    },
    // Show Color Picker
    //
    [shapesActions.showColorPicker]: (state: TShapes) => ({
        ...state,
        showColorPicker: true,
    }),
    // Hide Color Picker
    //
    [shapesActions.hideColorPicker]: (state: TShapes) => ({
        ...state,
        showColorPicker: false,
    }),
    // Copy active shapes
    //
    [shapesActions.copyActiveShapes]: (state: TShapes) => ({
        ...state,
        copiedShapes: state.list.reduce((acc, shape) => {
            if (shape.isSelected) {
                return [
                    ...acc,
                    // I need to clone here,
                    // so copied shape will keep exact coordinates of the moment of copying
                    shape.clone(),
                ];
            }
            return acc;
        }, []),
    }),
}, initState);
