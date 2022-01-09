import {
  CanvasAPI,
  SetImageProps,
  ShapeAddedProps,
  ShapeDeletedProps,
  StartAddingShapeProps,
  TWHSize,
} from './api-types';
import canvasStore from '../store';
import {
  blurShapes,
  setAddingShape,
  setFontSizeToActiveShape,
  setStrokeColorToActiveShape,
  setStrokeWidthToActiveShape,
  sketchifyActiveShape,
} from '../model/shapes/shapesActions';
import EShapeTypes from '../canvasShapes/Shape/shapeTypes';
import { addImageToStage } from '../addShape';
import { TCanvasState } from '../reducers';
import { copyStage, saveStage } from '../model/saveCanvas/saveCanvasActions';
import { generateImage } from '../services/image';
import { apiEventsFactory } from './events';
import Shape from '../canvasShapes/Shape/Shape';
import IShape from '../canvasShapes/Shape/IShape';

export const canvasApiFactory = (): CanvasAPI => {
  const startAddingShape = (props: StartAddingShapeProps) => {
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
          }),
        );
        break;
      case null:
        canvasStore.dispatch(
          setAddingShape({
            type: null,
          }),
        );
        break;
      default:
        throw new Error(`Given shape type can\'t be added: ${type}`);
    }
  };

  const setImage = (props: SetImageProps) => {
    addImageToStage(props);
  };

  const _setStrokeColorToActiveShape = (color: string) => {
    canvasStore.dispatch(setStrokeColorToActiveShape(color));
  };

  const _setStrokeWidthToActiveShape = (width: number) => {
    canvasStore.dispatch(setStrokeWidthToActiveShape(width));
  };

  const _setFontSizeToActiveShape = (size: number) => {
    canvasStore.dispatch(setFontSizeToActiveShape(size));
  };

  const exportCanvasToImage = (name: string) => {
    const { shapes, stage } = canvasStore.getState();

    if (!stage.instance) {
      throw new Error('Stage instance is not defined');
    }

    canvasStore.dispatch(
      saveStage({
        layer: shapes.shapesLayer,
        name,
        contentRect: stage.instance.getContentBoundariesRect(),
      }),
    );
  };

  const copyAllToClipboard = () => {
    const { stage, shapes } = canvasStore.getState();

    if (!stage.instance) {
      throw new Error('Stage instance is not defined');
    }

    canvasStore.dispatch(
      copyStage({
        layer: shapes.shapesLayer,
        contentRect: stage.instance.getContentBoundariesRect(),
      }),
    );
  };

  const _blurShapes = () => {
    canvasStore.dispatch(blurShapes());
  };

  const _sketchifyActiveShape = () => {
    canvasStore.dispatch(sketchifyActiveShape());
  };

  const getShapesAmount = () =>
    new Promise<number>((resolve) => {
      requestAnimationFrame(() => {
        const { shapes } = canvasStore.getState();
        resolve(shapes.list.length);
      });
    });

  const initBlankCanvas = (props: TWHSize) => {
    const { stage } = canvasStore.getState();
    if (!stage.instance) {
      throw new Error(
        `"instance" is not defined on stage. It looks like stage is not initialized yet.`,
      );
    }

    generateImage(props.width, props.height, '#cdcdcd').then((image) => {
      addImageToStage({
        image,
        name: 'Blank canvas',
      });
    });
  };

  return {
    startAddingShape,
    setImage,
    setStrokeColorToActiveShape: _setStrokeColorToActiveShape,
    setStrokeWidthToActiveShape: _setStrokeWidthToActiveShape,
    setFontSizeToActiveShape: _setFontSizeToActiveShape,
    exportCanvasToImage,
    copyAllToClipboard,
    blurShapes: _blurShapes,
    sketchifyActiveShape: _sketchifyActiveShape,
    getShapesAmount,
    initBlankCanvas,
    onShapeClicked: apiEventsFactory<IShape>('SHAPE_CLICKED'),
    onShapeDragStarted: apiEventsFactory<IShape>('SHAPE_DRAG_STARTED'),
    onShapesBlurred: apiEventsFactory<IShape>('SHAPES_BLURRED'),
    onShapeAdded: apiEventsFactory<ShapeAddedProps>('SHAPE_ADDED'),
    onShapeDeleted: apiEventsFactory<ShapeDeletedProps>('SHAPE_DELETED'),
  };
};
