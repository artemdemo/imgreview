import Konva from 'konva';
import {handleActions} from 'redux-actions';
import _get from 'lodash/get';
import * as shapesActions from './shapesActions';
import {ECursorTypes} from './shapesModelTypes';
import * as api from '../../api';
import Arrow from '../../Arrow/Arrow';
import Text from '../../Text/Text';
import Rect from '../../Rect/Rect';
import EShapeTypes from '../../Shape/shapeTypes';
import SelectRect from '../../Select/SelectRect';
import {
    _createArrow, _createEllipse,
    _createRect,
    _createSelectRect,
} from '../../addShape';
import Circle from '../../Ellipse/Ellipse';
import Ellipse from '../../Ellipse/Ellipse';
import Shape from '../../Shape/Shape';
import {ELayerTypes} from './shapesModelTypes';

type TOneOfShapeTypes = Arrow|Text|Rect|SelectRect|Circle;

export type TStateShapes = {
    cursor: ECursorTypes;
    // Layer that will contain all the shapes
    shapesLayer: Konva.Layer;
    // Layer for all the anchors (size and shape changes)
    anchorsLayer: Konva.Layer;
    // List of all added shapes
    list: TOneOfShapeTypes[];
    // User selects the shape he wants to add and then,
    // by clicking and moving his mouse on canvas he will define the place and size of the added shape.
    addingShapeRef: TOneOfShapeTypes|null;
};

const initState: TStateShapes = {
    cursor: ECursorTypes.AUTO,
    shapesLayer: new Konva.Layer(),
    anchorsLayer: new Konva.Layer(),
    list: [],
    addingShapeRef: null,
};

export default handleActions({
    [shapesActions.addShape]: (state: TStateShapes, action) => {
        (<Shape>action.payload).addToLayer(state.shapesLayer, state.anchorsLayer);
        state.shapesLayer.draw();
        state.anchorsLayer.draw();
        if (action.payload.type === EShapeTypes.TEXT) {
            api.shapeAdded(action.payload);
        }
        return {
            ...state,
            list: [
                ...state.list,
                action.payload,
            ],
        };
    },
    [shapesActions.setAddingShape]: (state: TStateShapes, action) => {
        const type = _get(action.payload, 'type', null);
        const options = _get(action.payload, 'options', null);
        let addingShapeRef: TOneOfShapeTypes|null = null;
        switch (type) {
            case EShapeTypes.ARROW:
                addingShapeRef = _createArrow(undefined, options);
                break;
            case EShapeTypes.RECT:
                addingShapeRef = _createRect(undefined, options);
                break;
            case EShapeTypes.ELLIPSE:
                addingShapeRef = _createEllipse(undefined, options);
                break;
            case EShapeTypes.SELECT_RECT:
                addingShapeRef = _createSelectRect();
                break;
            case null:
                addingShapeRef = null;
                break;
            default:
                console.error(`Can't set adding shape for the selected shape type: ${type}`);
        }
        return {
            ...state,
            addingShapeRef,
        };
    },
    [shapesActions.deleteAllShapes]: (state: TStateShapes) => {
        state.list.forEach(shape => shape.destroy());
        state.shapesLayer.draw();
        state.anchorsLayer.draw();
        return {
            ...state,
            list: [],
        }
    },
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
        state.anchorsLayer.draw();
        // I'm calling shapesBlurred() in order to make Menu refresh the list of items.
        api.shapesBlurred(action.payload);
        return state;
    },
    [shapesActions.cropShapes]: (state: TStateShapes, action) => {
        state.list.forEach((shape) => {
            shape.crop(action.payload);
        });
        state.shapesLayer.draw();
        state.anchorsLayer.draw();
        return state;
    },
    [shapesActions.deleteShape]: (state: TStateShapes, action) => {
        const shape = state.list.find(shape => shape === action.payload);
        if (shape) {
            shape.destroy();
        }
        // I'm calling shapesBlurred() in order to make Menu refresh the list of items.
        // This way menu items that related to the deleted shape will be hidden.
        api.shapesBlurred(action.payload);
        return {
            ...state,
            list: state.list.filter(shape => shape !== action.payload),
        };
    },
    [shapesActions.deleteActiveShapes]: (state: TStateShapes) => {
        const selectedShape = state.list.find(shape => shape.isSelected());
        if (selectedShape) {
            selectedShape.destroy();
        }
        state.shapesLayer.draw();
        state.anchorsLayer.draw();
        api.shapesBlurred();
        return {
            ...state,
            list: state.list.filter(shape => shape !== selectedShape),
        };
    },
    [shapesActions.setCursor]: (state: TStateShapes, action) => {
        return {
            ...state,
            cursor: action.payload,
        };
    },
    [shapesActions.setStrokeColorToActiveShape]: (state: TStateShapes, action) => {
        const selectedShape = state.list.find(shape => shape.isSelected());
        switch (selectedShape?.type) {
            case EShapeTypes.ARROW:
            case EShapeTypes.RECT:
            case EShapeTypes.ELLIPSE:
                (<Arrow|Rect|Ellipse>selectedShape).setStrokeColor(action.payload);
                break;
            case EShapeTypes.TEXT:
                (<Text>selectedShape).setFillColor(action.payload);
                break;
            default:
                console.error('Can\'t set stroke color for the selected shape');
                console.log(selectedShape);
        }
        state.shapesLayer.draw();
        return state;
    },
    [shapesActions.setStrokeWidthToActiveShape]: (state: TStateShapes, action) => {
        const selectedShape = state.list.find(shape => shape.isSelected());
        switch (selectedShape?.type) {
            case EShapeTypes.ARROW:
            case EShapeTypes.RECT:
            case EShapeTypes.ELLIPSE:
                (<Arrow|Rect|Ellipse>selectedShape).setStrokeWidth(action.payload);
                break;
            default:
                console.error('Can\'t set stroke width for the selected shape');
                console.log(selectedShape);
        }
        state.shapesLayer.draw();
        return state;
    },
    [shapesActions.setFontSizeToActiveShape]: (state: TStateShapes, action) => {
        const selectedShape = state.list.find(shape => shape.isSelected());
        switch (selectedShape?.type) {
            case EShapeTypes.TEXT:
                (<Text>selectedShape).setFontSize(action.payload);
                break;
            default:
                console.error('Can\'t set font size for the selected shape');
                console.log(selectedShape);
        }
        return state;
    },
    [shapesActions.scaleShapes]: (state: TStateShapes, action) => {
        if (action.payload) {
            state.list.forEach(shape => shape.scale(action.payload));
        }
        return state;
    },
    [shapesActions.drawLayers]: (state: TStateShapes, action) => {
        switch (action.payload) {
            case ELayerTypes.SHAPES_LAYER:
                state.shapesLayer.draw();
                break;
            case ELayerTypes.ANCHORS_LAYER:
                state.anchorsLayer.draw();
                break;
            default:
                state.shapesLayer.draw();
                state.anchorsLayer.draw();
        }
        return state;
    },
}, initState);
