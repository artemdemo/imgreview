import _get from 'lodash/get';
import { connectArrow, connectText, addImageToStage } from '../addShape';
import * as api from '../api';
import {
    blurShapes,
    scaleShapes,
    setStrokeColorToActiveShape,
    TSetStrokeWidthToActiveShape,
    setStrokeWidthToActiveShape,
} from '../model/shapes/shapesActions';
import canvasStore from '../store';
import { TCanvasState } from '../reducers';
import { TCreateArrowOptions } from './eventsTypes';

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
api.createArrow.on((options?: TCreateArrowOptions) => {
    connectArrow(
        null,
        {
            strokeColor: _get(options, 'strokeColor', 'green'),
            strokeWidth: _get(options, 'strokeWidth', 5),
        },
    );
});

// @ts-ignore
api.createText.on(() => {
    connectText();
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
    if (!stage.instance || !image.instance) {
        const type = !stage.instance ? 'stage' : 'image';
        throw new Error(`"instance" is not defined on "${type}".  It looks like "${type}" is not initialized yet.`);
    }

    const originalStageSize: api.TCanvasSize = {
        width: stage.instance.attrs.width,
        height: stage.instance.attrs.height,
    };
    stage.instance.setAttr('width', data.width);
    stage.instance.setAttr('height', data.height);
    image.instance.setSize(data.width, data.height);
    canvasStore.dispatch(scaleShapes({
        wFactor: data.width / originalStageSize.width,
        hFactor: data.height / originalStageSize.height,
    }));
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
