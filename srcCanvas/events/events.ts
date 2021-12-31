import { addImageToStage } from '../addShape';
import * as api from '../api';
import {
  blurShapes,
  deleteShape,
  cropShapes,
  setFontSizeToActiveShape,
  setStrokeColorToActiveShape,
  setStrokeWidthToActiveShape,
  setAddingShape,
  sketchifyActiveShape,
} from '../model/shapes/shapesActions';
import { setStageSize } from '../model/stage/stageActions';
import { saveStage, copyStage } from '../model/saveCanvas/saveCanvasActions';
import canvasStore from '../store';
import { TCanvasState } from '../reducers';
import EShapeTypes from '../canvasShapes/Shape/shapeTypes';
import SelectRect from '../canvasShapes/RectLike/SelectRect';
import { generateImage } from '../services/image';

api.startAddingShape.on((props) => {
  // In any event first I'm blurting all shapes.
  // Since I'm about to add a new one.
  canvasStore.dispatch(blurShapes());

  const { type, options } = props;

  switch (type) {
    case EShapeTypes.TEXT:
    case EShapeTypes.ARROW:
    case EShapeTypes.RECT:
    case EShapeTypes.RECT_ROUGH:
    case EShapeTypes.ELLIPSE:
    case EShapeTypes.ELLIPSE_ROUGH:
    case EShapeTypes.SELECT_RECT:
      canvasStore.dispatch(
        setAddingShape({
          type,
          options,
        })
      );
      break;
    case null:
      canvasStore.dispatch(
        setAddingShape({
          type: null,
        })
      );
      break;
    default:
      throw new Error(`Given shape type can\'t be added: ${type}`);
  }
});

api.setImage.on((props) => {
  addImageToStage(props);
});

api.setStrokeColorToActiveShape.on((color) => {
  canvasStore.dispatch(setStrokeColorToActiveShape(color));
});

api.setStrokeWidthToActiveShape.on((props) => {
  canvasStore.dispatch(setStrokeWidthToActiveShape(props));
});

api.setFontSizeToActiveShape.on((props) => {
  canvasStore.dispatch(setFontSizeToActiveShape(props));
});

api.exportCanvasToImage.on((name) => {
  const { shapes, stage } = <TCanvasState>canvasStore.getState();

  if (!stage.instance) {
    throw new Error('Stage instance is not defined');
  }

  canvasStore.dispatch(
    saveStage({
      layer: shapes.shapesLayer,
      name,
      contentRect: stage.instance.getContentBoundariesRect(),
    })
  );
});

api.copyAllToClipboard.on(() => {
  const { stage, shapes } = <TCanvasState>canvasStore.getState();

  if (!stage.instance) {
    throw new Error('Stage instance is not defined');
  }

  canvasStore.dispatch(
    copyStage({
      layer: shapes.shapesLayer,
      contentRect: stage.instance.getContentBoundariesRect(),
    })
  );
});

api.blurShapes.on(() => {
  canvasStore.dispatch(blurShapes());
});

api.cropSelected.on(() => {
  const { shapes } = <TCanvasState>canvasStore.getState();
  const selectedShape = shapes.list.find((shape) => shape.isSelected());
  if (selectedShape instanceof SelectRect) {
    const { x, y, width, height } = selectedShape.getAttrs();
    canvasStore.dispatch(setStageSize({ width, height }));
    canvasStore.dispatch(deleteShape(selectedShape));
    canvasStore.dispatch(cropShapes({ x, y }));
    canvasStore.dispatch(blurShapes());
  } else {
    console.error('Selected shape is not instance of SelectRect');
    console.error(selectedShape);
  }
});

api.sketchifyActiveShape.on(() => {
  canvasStore.dispatch(sketchifyActiveShape());
});

// ToDo: This API is no longer supported, since canvas is nov infinite.
//  I can't resize infinite canvas.
// api.updateCanvasSize.on((props) => {
//   const { stage, image } = <TCanvasState>canvasStore.getState();
//   if (!stage.instance) {
//     throw new Error(
//       '"instance" is not defined on "stage".  It looks like "stage" is not initialized yet.'
//     );
//   }
//
//   const { width, height } = stage.instance.getAttrs();
//
//   const originalStageSize: api.TWHSize = {
//     width,
//     height,
//   };
//   canvasStore.dispatch(
//     setStageSize({
//       width: props.width,
//       height: props.height,
//     })
//   );
//
//   if (image.instance) {
//     // Here I'm replacing image with the new instance.
//     // Otherwise, there will be a problem with image size,
//     // when you change it's not really resizing.
//     // As far as konva concerns, image will stay the same, only visually it change.
//     // The problem with that appears when you want to crop something out of the image after resizing.
//     //
//     // image.instance.setSize(props.width, props.height);
//
//     const imgLayerDataUrl = image.layer.toDataURL();
//     image.instance.destroy();
//     Konva.Image.fromURL(imgLayerDataUrl, (img) => {
//       const canvasImage = new CanvasImage(img);
//       canvasImage.addToLayer(image.layer);
//       canvasStore.dispatch(
//         setImage({
//           image: canvasImage,
//         })
//       );
//     });
//   }
//
//   // I need this call in order to refresh state.
//   // This way all canvas frame related sizes will be updated.
//   canvasStore.dispatch(scaleShapes());
//
//   // Now I'm waiting to the next frame in order to measure new position of the stage container.
//   // Otherwise, I wouldn't receive updated size.
//   requestAnimationFrame(() => {
//     // I will need stage position to update it in specific shapes.
//     // For example `Text` shape will need it for editing.
//     const stageBox = stage.instance?.container().getBoundingClientRect();
//
//     const scaleProps: TScaleProps = {
//       wFactor: props.width / originalStageSize.width,
//       hFactor: props.height / originalStageSize.height,
//       stagePosition: {
//         left: stageBox ? stageBox.left : 0,
//         top: stageBox ? stageBox.top : 0,
//       },
//     };
//
//     canvasStore.dispatch(scaleShapes(scaleProps));
//   });
// });

api.initBlankCanvas.on((props) => {
  const { stage } = <TCanvasState>canvasStore.getState();
  if (!stage.instance) {
    throw new Error(
      `"instance" is not defined on stage. It looks like stage is not initialized yet.`
    );
  }

  generateImage(props.width, props.height, '#cdcdcd').then((image) => {
    addImageToStage({
      image,
      name: 'Blank canvas',
    });
  });
});
