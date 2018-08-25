import * as shapesActions from './shapesActions';

const initState = {
    stroke: 'red',
    strokeWidth: 5,
    showColorPicker: false,
    list: [],
};

export default function shapesReducer(state = initState, action) {
    switch (action.type) {
        // Add Arrow
        //
        case `${shapesActions.addArrow}`:
            return {
                ...state,
                list: [
                    ...state.list,
                    action.arrow,
                ],
            };
        // Set Stroke Color
        //
        case `${shapesActions.setStroke}`:
            state.list.forEach((shape) => {
                if (shape.isSelected && shape.setStroke) {
                    shape.setStroke(action.stroke);
                }
            });
            return {
                ...state,
                stroke: action.stroke,
            };
        // Blur Shapes
        //
        case `${shapesActions.blurShapes}`:
            state.list.forEach((shape) => {
                // Blur all shapes that have `clearFocus`
                // and are not an exception.
                // I need `exceptShape` in order to not blur shape that user clicked on
                // it's useful in case there are number of shapes on the stage and user just clicked on another one
                if (shape.clearFocus && shape !== action.exceptShape) {
                    shape.clearFocus();
                }
            });
            return state;
        // Show Color Picker
        //
        case `${shapesActions.showColorPicker}`:
            return {
                ...state,
                showColorPicker: true,
            };
        // Hide Color Picker
        //
        case `${shapesActions.hideColorPicker}`:
            return {
                ...state,
                showColorPicker: false,
            };
        default:
            return state;
    }
}
