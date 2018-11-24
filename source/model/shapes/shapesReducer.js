import { createReducer } from 'redux-act';
import _get from 'lodash/get';
import * as shapesActions from './shapesActions';

const initState = {
    stroke: 'red',
    strokeWidth: 5,
    showColorPicker: false,
    list: [],
    copiedShapes: [],
};

export default createReducer({
    // Add Arrow
    //
    [shapesActions.addArrow]: (state, payload) => ({
        ...state,
        list: [
            ...state.list,
            payload,
        ],
    }),
    // Set Stroke Color
    //
    [shapesActions.setStroke]: (state, payload) => {
        state.list.forEach((shape) => {
            if (shape.isSelected && shape.setStroke) {
                shape.setStroke(payload);
            }
        });
        return {
            ...state,
            stroke: payload,
        };
    },
    // Blur Shapes
    //
    [shapesActions.blurShapes]: (state, payload) => {
        state.list.forEach((shape) => {
            // Blur all shapes that have `clearFocus`
            // and are not an exception.
            // I need `exceptShape` in order to not blur shape that user clicked on
            // it's useful in case there are number of shapes on the stage and user just clicked on another one
            if (shape.clearFocus && shape !== payload) {
                shape.clearFocus();
            }
        });
        return state;
    },
    // Delete Shape
    //
    [shapesActions.deleteActiveShape]: (state) => {
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
    [shapesActions.showColorPicker]: state => ({
        ...state,
        showColorPicker: true,
    }),
    // Hide Color Picker
    //
    [shapesActions.showColorPicker]: state => ({
        ...state,
        showColorPicker: false,
    }),
    // Copy active shapes
    //
    [shapesActions.copyActiveShapes]: state => ({
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
