import _get from 'lodash/get';
import {addImageToStage, connectArrow, connectRect, connectText} from '../addShape';
import * as api from '../api';
import {
    blurShapes,
    scaleShapes,
    setFontSizeToActiveShape,
    setStrokeColorToActiveShape,
    setStrokeWidthToActiveShape,
} from '../model/shapes/shapesActions';
import canvasStore from '../store';
import {TCanvasState} from '../reducers';
import {TCreateArrowOptions, TCreateTextOptions} from './eventsTypes';
import {TScaleProps} from '../Shape/IShape';
import EShapeTypes from "../Shape/shapeTypes";

// edited https://stackoverflow.com/a/37138144
function dataURIToBlob(dataUrl: string) {
    const arr = dataUrl.split(',');
    if (arr[0]) {
        const match = arr[0].match(/:(.*?);/);
        if (match) {
            const type = match[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);

            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], { type });
        }
    }
    return null;
}

// https://stackoverflow.com/a/37138144
function downloadURI(uri: string, name: string) {
    const link = document.createElement('a');
    const blob = dataURIToBlob(uri);
    const objUrl = URL.createObjectURL(blob);

    link.download = name.replace(/(\.[^.]+)$/gi, '') + '.png';
    link.href = objUrl;
    link.click();
}

// @ts-ignore
api.createShape.on((type: EShapeTypes, options?: any) => {
    switch (type) {
        case EShapeTypes.ARROW:
            connectArrow(
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
            connectRect(undefined, options);
            break;
        default:
            throw new Error(`Given shape type can\'t be created: ${type}`);
    }
});

// @ts-ignore
api.setImage.on((data: api.TImageData) => {
    addImageToStage(data);
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
api.blurShapes.on(() => {
    canvasStore.dispatch(blurShapes())
});

// @ts-ignore
api.updateCanvasSize.on((data: api.TCanvasSize) => {
    const { stage, image } = <TCanvasState>canvasStore.getState();
    if (!stage.instance) {
        throw new Error('"instance" is not defined on "stage".  It looks like "stage" is not initialized yet.');
    }

    const originalStageSize: api.TCanvasSize = {
        width: stage.instance.attrs.width,
        height: stage.instance.attrs.height,
    };
    stage.instance.setAttrs({
        width: data.width,
        height: data.height,
    });

    // There could be no image, for example in development when using "Blank" canvas
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

    stage.instance.setAttr('width', props.width);
    stage.instance.setAttr('height', props.height);
});
