import React, { useRef } from 'react';
import { GlobalHotKeys } from 'react-hotkeys';
import canvasStore from '../store';
import { deleteActiveShapes, setCursor } from '../model/shapes/shapesActions';
import { ECursorTypes } from '../model/shapes/shapesModelTypes';
import { TCanvasState } from '../reducers';
import * as clipboard from '../services/clipboard';
import * as canvasApi from '../api';
import Shape from '../Shape/Shape';
import { cloneAndConnectShape } from '../addShape';
import { TOneOfShapeTypes } from '../model/shapes/shapesReducer';

const keyMap = {
  delete: ['backspace', 'delete', 'del'],
  copy: ['ctrl+c', 'command+c'],
  paste: ['ctrl+v', 'command+v'],
};

export const KeyboardEvents: React.FC = () => {
  const copiedShapes = useRef<TOneOfShapeTypes[]>([]);

  const onDelete = () => {
    canvasStore.dispatch(deleteActiveShapes());
    // In case users cursor is on the shape that is being deleted.
    // I need to remove cursor styling from the parent.
    canvasStore.dispatch(setCursor(ECursorTypes.AUTO));
  };

  const onCopy = () => {
    const { shapes } = canvasStore.getState() as TCanvasState;

    // Here I'm coping a dummy text into the clipboard.
    // This is workaround for case when user has image in the clipboard.
    // In this scenario after copying a shape and pasting it - image will appear and override everything.
    // ToDo: Copy image of the shape into the clipboard.
    //       This approach will be much better experience.
    clipboard.copyToClipboard('[Shape]');

    copiedShapes.current = shapes.list.reduce((acc: any[], shape) => {
      if (shape.isSelected()) {
        return [
          ...acc,
          // I need to clone here,
          // so copied shape will keep exact coordinates of the moment of copying
          shape.clone(),
        ];
      }
      return acc;
    }, []);
  };

  const onPaste = () => {
    canvasApi.blurShapes();
    copiedShapes.current.forEach((shape: Shape) => {
      cloneAndConnectShape(shape);
    });
    copiedShapes.current = [];
  };

  return (
    <GlobalHotKeys
      keyMap={keyMap}
      handlers={{ delete: onDelete, copy: onCopy, paste: onPaste }}
    />
  );
};
