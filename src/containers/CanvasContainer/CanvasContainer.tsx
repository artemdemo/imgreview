import React, { useEffect, useState } from 'react';
import CanvasEl from '../../../srcCanvas/CanvasEl/CanvasEl';
import { DropImage } from './DropImage';
import * as canvasApi from '../../../srcCanvas/api';
import { HowToStart } from './HowToStart';

const CanvasContainer: React.FC = () => {
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
        canvasApi.setImage({
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

  const [hasShapes, setHasShapes] = useState(false);

  const handleShapeAddDelete = (props: { shapesList: any[] }) => {
    const { shapesList } = props;
    setHasShapes(shapesList.length > 0);
  };

  useEffect(() => {
    document.addEventListener('paste', onPaste);
    const unsubShapeAdded = canvasApi.shapeAdded.on(handleShapeAddDelete);
    const unsubShapeDeleted = canvasApi.shapeDeleted.on(handleShapeAddDelete);
    return () => {
      document.removeEventListener('paste', onPaste);
      unsubShapeAdded();
      unsubShapeDeleted();
    };
  }, []);

  return (
    <DropImage>
      {!hasShapes && <HowToStart />}
      <CanvasEl />
    </DropImage>
  );
};

export default CanvasContainer;
