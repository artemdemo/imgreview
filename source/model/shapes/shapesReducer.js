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
            return {
                ...state,
                stroke: action.stroke,
            };
        // Blur Shapes
        //
        case `${shapesActions.blurShapes}`:
            state.list.forEach((shape) => {
                if (shape.clearFocus) {
                    shape.clearFocus();
                }
            });
            return state;
        case `${shapesActions.showColorPicker}`:
            return {
                ...state,
                showColorPicker: true,
            };
        case `${shapesActions.hideColorPicker}`:
            return {
                ...state,
                showColorPicker: false,
            };
        default:
            return state;
    }
};
