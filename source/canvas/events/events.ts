import emitter from './eventsEmitter';
import { connectArrow, addImageToStage } from '../addShape';
import CanvasEl from '../CanvasEl/CanvasEl';
import * as keys from './eventsKeys';
import { TImageData, TCanvasSize } from '../api';
import { updateImageSize } from '../../model/canvas/canvasActions';
import canvasStore from '../store';
import { TCanvasState } from '../reducers';
import store from '../../store';

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

    link.download = name;
    link.href = objUrl;
    link.click();
}

emitter.on(keys.CREATE_ARROW, (options?: { strokeColor: string, strokeWidth: number }) => {
    connectArrow(
        null,
        {
            strokeColor: 'green',
            strokeWidth: 5,
        },
    );
});

emitter.on(keys.SET_IMAGE, (data: TImageData) => {
    addImageToStage(data);
});

emitter.on(keys.EXPORT_CANVAS_TO_IMAGE, (name: string) => {
    const dataURL = CanvasEl.stage.toDataURL();
    downloadURI(dataURL, name);
});

emitter.on(keys.UPDATE_CANVAS_SIZE, (data: TCanvasSize) => {
    const { stage, image } = <TCanvasState>canvasStore.getState();
    stage.instance.setAttr('width', data.width);
    stage.instance.setAttr('height', data.height);
    image.instance.setSize(data.width, data.height);
    store.dispatch(updateImageSize(data));
});
