import React, { useEffect, useRef } from 'react';
import { GlobalHotKeys } from 'react-hotkeys';
import _ from 'lodash';
import canvasStore from '../store';
import {
  blurShapes,
  deleteActiveShapes,
  setCursor,
} from '../model/shapes/shapesActions';
import { ECursorTypes } from '../model/shapes/shapesModelTypes';
import { TCanvasState } from '../reducers';
import * as clipboard from '../services/clipboard';
import Shape from '../canvasShapes/Shape/Shape';
import { cloneAndConnectShape } from '../addShape';
import { TOneOfShapeTypes } from '../model/shapes/shapesReducer';
import { setRatioShift, setStageDraggable } from '../model/stage/stageActions';

const keyMap = {
  onDelete: ['backspace', 'delete', 'del'],
  onCopy: ['ctrl+c', 'command+c'],
  onPaste: ['ctrl+v', 'command+v'],
  onActivateDrag: {
    sequence: 'space',
    action: 'keydown',
  },
  onDisableDrag: {
    sequence: 'space',
    action: 'keyup',
  },
  onActivateRatio: {
    sequence: 'shift',
    action: 'keydown',
  },
  onDisableRatio: {
    sequence: 'shift',
    action: 'keyup',
  },
};

export const KeyboardEvents: React.FC = () => {
  const copiedShapes = useRef<TOneOfShapeTypes[]>([]);

  useEffect(() => {
    const onTabFocus = _.throttle(() => {
      onDisableDrag();
      onDisableRatio();
    }, 50);
    window.addEventListener('focus', onTabFocus, { capture: true });
    return () => {
      window.removeEventListener('focus', onTabFocus);
    };
  }, []);

  const onDelete = () => {
    canvasStore.dispatch(deleteActiveShapes());
    // In case users cursor is on the shape that is being deleted.
    // I need to remove cursor styling from the parent.
    canvasStore.dispatch(setCursor(ECursorTypes.AUTO));
  };

  const onCopy = () => {
    const { shapes } = canvasStore.getState();

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
    canvasStore.dispatch(blurShapes());
    copiedShapes.current.forEach((shape: Shape) => {
      cloneAndConnectShape(shape);
    });
    copiedShapes.current = [];
  };

  const onActivateDrag = () => {
    const { shapes } = canvasStore.getState();
    canvasStore.dispatch(setStageDraggable(true));
    // User should be able to drag stage holding by any part of the canvas.
    // Even if this "part" is another shape.
    // Therefore, I'm while "space" is clicked all shapes should be not draggable.
    shapes.list.forEach((item) => {
      item.draggable(false);
    });
    canvasStore.dispatch(setCursor(ECursorTypes.GRAB));
  };

  const onDisableDrag = () => {
    const { shapes } = canvasStore.getState();
    canvasStore.dispatch(setStageDraggable(false));
    shapes.list.forEach((item) => {
      item.draggable(true);
    });
    canvasStore.dispatch(setCursor(ECursorTypes.AUTO));
  };

  const onActivateRatio = () => {
    canvasStore.dispatch(setRatioShift(true));
  };

  const onDisableRatio = () => {
    canvasStore.dispatch(setRatioShift(false));
  };

  return (
    <GlobalHotKeys
      // @ts-ignore
      keyMap={keyMap}
      handlers={{
        onDelete,
        onCopy,
        onPaste,
        onActivateDrag,
        onDisableDrag,
        onActivateRatio,
        onDisableRatio,
      }}
    />
  );
};
