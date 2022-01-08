import React, { useContext, useEffect, useState } from 'react';
import _ from 'lodash';
import CanvasEl from '../../../srcCanvas/CanvasEl/CanvasEl';
import { DropImage } from './DropImage';
import { HowToStart } from './HowToStart';
import { AppStateContext } from '../../model/AppStateContext';
import { setCanvasApi } from '../../model/canvas/canvasActions';
import IShape from '../../../srcCanvas/canvasShapes/Shape/IShape';

// I need to keep reference to previous data,
// so when user is going to another page (for example "About") and back,
// I'll be able to set correct availability of relevant items.
// ToDo: It should be solved by new version of CanvasApi, which methods will return values.
let hasShapesInit = false;

const CanvasContainer: React.FC = () => {
  const [hasShapes, setHasShapes] = useState(hasShapesInit);
  const {
    state: {
      canvas: { canvasApi },
    },
    dispatch,
  } = useContext(AppStateContext);

  /**
   * This paste method is only meant to be used to paste images.
   * Shape paste is handled by `CanvasEl`
   * @link https://stackoverflow.com/a/15369753
   * @param event
   */
  const onPaste = (event: any) => {
    // use event.originalEvent.clipboard for newer chrome versions
    // @ts-ignore
    const items = (event.clipboardData || event.originalEvent.clipboardData)
      .items;
    const blobRaw = (Array.from(items) as DataTransferItem[]).find((item) => {
      return item.type.indexOf('image') === 0;
    });
    if (blobRaw) {
      const blob = (blobRaw as DataTransferItem).getAsFile();
      const img = new Image();
      if (!blob) {
        throw new Error('blob data is null');
      }
      const url = URL.createObjectURL(blob);
      img.onload = function () {
        URL.revokeObjectURL(url);
        canvasApi?.setImage({
          image: this,
          name: '',
        });
      };
      img.onerror = (err) => {
        console.error(err);
      };
      img.src = url;
    }
  };

  const handleShapeAddDelete = (props: { shapesList: IShape[] }) => {
    const { shapesList } = props;
    setHasShapes(shapesList.length > 0);
  };

  useEffect(() => {
    document.addEventListener('paste', onPaste);
    let unsubShapeAdded = _.noop;
    let unsubShapeDeleted = _.noop;
    if (canvasApi) {
      unsubShapeAdded = canvasApi.onShapeAdded(handleShapeAddDelete);
      unsubShapeDeleted = canvasApi.onShapeDeleted(handleShapeAddDelete);
    }
    return () => {
      document.removeEventListener('paste', onPaste);
      unsubShapeAdded();
      unsubShapeDeleted();
    };
  }, [canvasApi]);

  useEffect(() => {
    hasShapesInit = hasShapes;
  }, [hasShapes]);

  return (
    <DropImage>
      {!hasShapes && <HowToStart />}
      <CanvasEl
        onReady={(canvasApi) => {
          dispatch(setCanvasApi(canvasApi));
        }}
      />
    </DropImage>
  );
};

export default CanvasContainer;
