import _get from 'lodash/get';
import {
    addImageToStage,
    connectText,
} from '../addShape';
import * as api from '../api';
import {
    blurShapes,
    deleteShape,
    scaleShapes,
    cropShapes,
    setFontSizeToActiveShape,
    setStrokeColorToActiveShape,
    setStrokeWidthToActiveShape,
    setAddingShape,
    sketchifyActiveShape,
} from '../model/shapes/shapesActions';
import {
    updateImageSize,
    cropImage,
} from '../model/image/imageActions';
import {
    setStageSize,
} from '../model/stage/stageActions';
import canvasStore from '../store';
import {TCanvasState} from '../reducers';
import {TScaleProps} from '../Shape/IShape';
import EShapeTypes from '../Shape/shapeTypes';
import SelectRect from '../Select/SelectRect';
import { generateImage, downloadURI } from '../services/image';
import * as clipboard from '../services/clipboard';

api.createShape.on((props: api.TCreateShape) => {
    // In any event first I'm blurting all shapes.
    // Since I'm about to create a new one.
    canvasStore.dispatch(blurShapes());

    const { type, options } = props;

    switch (type) {
        case EShapeTypes.TEXT:
            connectText(undefined, {
                fillColor: _get(options, 'fillColor', 'black'),
                fontSize: _get(options, 'fontSize'),
            });
            break;
        default:
            throw new Error(`Given shape type can\'t be created: ${type}`);
    }
});

api.startAddingShape.on((props: api.TStartAddingShapeProps) => {
    // In any event first I'm blurting all shapes.
    // Since I'm about to add a new one.
    canvasStore.dispatch(blurShapes());

    const { type, options } = props;

    switch (type) {
        case EShapeTypes.ARROW:
        case EShapeTypes.RECT:
        case EShapeTypes.ELLIPSE:
        case EShapeTypes.SELECT_RECT:
            canvasStore.dispatch(setAddingShape({
                type,
                options,
            }));
            break;
        case null:
            canvasStore.dispatch(setAddingShape({
                type: null,
            }));
            break;
        default:
            throw new Error(`Given shape type can\'t be added: ${type}`);
    }
});

api.setImage.on((props: api.TSetImage) => {
    addImageToStage(props);
});

api.setStrokeColorToActiveShape.on((props: api.TSetStrokeColorToActiveShape) => {
    canvasStore.dispatch(setStrokeColorToActiveShape(props));
});

api.setStrokeWidthToActiveShape.on((props: api.TSetStrokeWidthToActiveShape) => {
    canvasStore.dispatch(setStrokeWidthToActiveShape(props));
});

api.setFontSizeToActiveShape.on((props: api.TSetFontSizeToActiveShape) => {
    canvasStore.dispatch(setFontSizeToActiveShape(props));
});

api.exportCanvasToImage.on((name: api.TExportCanvasToImage) => {
    const { stage } = <TCanvasState>canvasStore.getState();
    if (stage.instance) {
        const dataURL = stage.instance.toDataURL();
        downloadURI(dataURL, name);
    } else {
        throw new Error('stage is not defined');
    }
});

api.copyAllToClipboard.on(() => {
    const { stage } = <TCanvasState>canvasStore.getState();
    if (stage.instance) {
        const dataURL = stage.instance.toDataURL();
        clipboard.copyDataUrlAsImage(dataURL);
    } else {
        throw new Error('stage is not defined');
    }
});

api.blurShapes.on(() => {
    canvasStore.dispatch(blurShapes())
});

api.cropSelected.on(() => {
    const { shapes } = <TCanvasState>canvasStore.getState();
    const selectedShape = shapes.list.find(shape => shape.isSelected());
    if (selectedShape instanceof SelectRect) {
        const { x, y, width, height } = selectedShape.getAttrs();
        canvasStore.dispatch(cropImage({ x,y, width, height }));
        canvasStore.dispatch(updateImageSize({ width, height }));
        canvasStore.dispatch(setStageSize({ width, height }));
        canvasStore.dispatch(deleteShape(selectedShape));
        canvasStore.dispatch(cropShapes({ x, y }));
    } else {
        console.error('Selected shape is not instance of SelectRect');
        console.error(selectedShape);
    }
});

api.updateCanvasSize.on((props: api.TUpdateCanvasSize) => {
    const { stage, image } = <TCanvasState>canvasStore.getState();
    if (!stage.instance) {
        throw new Error('"instance" is not defined on "stage".  It looks like "stage" is not initialized yet.');
    }

    const { width, height } = stage.instance.getAttrs();

    const originalStageSize: api.TWHSize = {
        width,
        height,
    };
    canvasStore.dispatch(setStageSize({
        width: props.width,
        height: props.height,
    }));

    image.instance?.setSize(props.width, props.height);

    // I need this call in order to refresh state.
    // This way all canvas frame related sizes will be updated.
    canvasStore.dispatch(scaleShapes());

    // Now I'm waiting to the next frame in order to measure new position of the stage container.
    // Otherwise I wouldn't receive updated size.
    requestAnimationFrame(() => {
        // I will need stage position to update it in specific shapes.
        // For example `Text` shape will need it for editing.
        const stageBox = stage.instance?.container().getBoundingClientRect();

        const scaleProps: TScaleProps = {
            wFactor: props.width / originalStageSize.width,
            hFactor: props.height / originalStageSize.height,
            stagePosition: {
                left: stageBox ? stageBox.left : 0,
                top: stageBox ? stageBox.top : 0,
            },
        };

        canvasStore.dispatch(scaleShapes(scaleProps));
    });
});

api.initBlankCanvas.on((props: api.TInitBlankCanvas) => {
    const { stage } = <TCanvasState>canvasStore.getState();
    if (!stage.instance) {
        throw new Error(`"instance" is not defined on stage. It looks like stage is not initialized yet.`);
    }

    generateImage(props.width, props.height, '#cdcdcd')
        .then((image) => {
            addImageToStage({
                image,
                name: 'Blank canvas',
            });
        });
});
