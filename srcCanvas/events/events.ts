import _get from 'lodash/get';
import {
    addImageToStage,
    createAndConnectArrow,
    createAndConnectRect,
    createAndConnectSelectRect,
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
} from '../model/shapes/shapesActions';
import { TAddingShape } from '../model/shapes/shapesTypes';
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
import * as utils from '../services/utils';

// @ts-ignore
api.createShape.on((type: EShapeTypes, options?: any) => {
    switch (type) {
        case EShapeTypes.ARROW:
            createAndConnectArrow(
                undefined,
                {
                    strokeColor: _get(options, 'strokeColor', 'green'),
                    strokeWidth: _get(options, 'strokeWidth', 5),
                },
            );
            break;
        case EShapeTypes.TEXT:
            connectText(undefined, {
                fillColor: _get(options, 'fillColor', 'black'),
                fontSize: _get(options, 'fontSize'),
            });
            break;
        case EShapeTypes.RECT:
            createAndConnectRect(undefined, options);
            break;
        case EShapeTypes.SELECT_RECT:
            createAndConnectSelectRect();
            break;
        default:
            throw new Error(`Given shape type can\'t be created: ${type}`);
    }
});

// @ts-ignore
api.startAddingShape.on((type: TAddingShape, options?: any) => {
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
        default:
            throw new Error(`Given shape type can\'t be added: ${type}`);
    }
});

// @ts-ignore
api.setImage.on((data: api.TImageData) => {
    addImageToStage(data);
});

// @ts-ignore
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

// @ts-ignore
api.setStrokeColorToActiveShape.on((hex: string) => {
    canvasStore.dispatch(setStrokeColorToActiveShape(hex));
});

// @ts-ignore
api.setStrokeWidthToActiveShape.on((width: number) => {
    canvasStore.dispatch(setStrokeWidthToActiveShape(width));
});

// @ts-ignore
api.setFontSizeToActiveShape.on((fontSize: number) => {
    canvasStore.dispatch(setFontSizeToActiveShape(fontSize));
});

// @ts-ignore
api.exportCanvasToImage.on((name: string) => {
    const { stage } = <TCanvasState>canvasStore.getState();
    if (stage.instance) {
        const dataURL = stage.instance.toDataURL();
        downloadURI(dataURL, name);
    } else {
        throw new Error('stage is not defined');
    }
});

// @ts-ignore
api.copyAllToClipboard.on(() => {
    const { stage } = <TCanvasState>canvasStore.getState();
    if (stage.instance) {
        const dataURL = stage.instance.toDataURL();
        utils.copyDataUrlAsImage(dataURL);
    } else {
        throw new Error('stage is not defined');
    }
});

// @ts-ignore
api.blurShapes.on(() => {
    canvasStore.dispatch(blurShapes())
});

// @ts-ignore
api.updateCanvasSize.on((data: api.TCanvasSize) => {
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
        width: data.width,
        height: data.height,
    }));

    image.instance?.setSize(data.width, data.height);

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
            wFactor: data.width / originalStageSize.width,
            hFactor: data.height / originalStageSize.height,
            stagePosition: {
                left: stageBox ? stageBox.left : 0,
                top: stageBox ? stageBox.top : 0,
            },
        };

        canvasStore.dispatch(scaleShapes(scaleProps));
    });
});

// @ts-ignore
api.initBlankCanvas.on((props: { width: number, height: number}) => {
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
