import React from 'react';
import Konva, { TPos } from 'konva';
import {
  blurShapes,
  setAddingShape,
  drawLayers,
} from '../model/shapes/shapesActions';
import * as canvasApi from '../../srcCanvas/api';
import { connectShape } from '../addShape';
import { TCanvasState } from '../reducers';
import canvasStore from '../store';
import { setStage } from '../model/stage/stageActions';
import {
  SHAPES_LAYER_CLS,
  ANCHORS_LAYER_CLS,
  IMAGE_LAYER_CLS,
} from '../model/shapes/shapesConst';
import '../events/events';
import './CanvasEl.less';
import { KeyboardEvents } from './KeyboardEvents';
import { CanvasWrapper } from './CanvasWrapper';

type Props = {};

type State = {
  mouseIsDown: boolean;
  mouseStartPos: TPos;
};

export const getShapesLayerEl = (): HTMLCanvasElement => {
  const shapesLayerEl: HTMLCanvasElement | null = document.querySelector(
    `.${SHAPES_LAYER_CLS}`
  );
  if (shapesLayerEl) {
    return shapesLayerEl;
  }
  throw new Error(`Shapes layer is not found`);
};

/**
 * CanvasEl will be used inside the main app.
 * Therefore, I can't use `connect()` here, since the context will be of the main app and not of the canvas.
 */
class CanvasEl extends React.PureComponent<Props, State> {
  readonly canvasRef = React.createRef<HTMLDivElement>();

  state = {
    mouseIsDown: false,
    mouseStartPos: { x: 0, y: 0 },
  };

  componentDidMount() {
    if (this.canvasRef.current) {
      const stage = new Konva.Stage({
        container: this.canvasRef.current,
        width: window.innerWidth,
        height: window.innerHeight,
      });
      const { shapes, image } = canvasStore.getState() as TCanvasState;
      stage.add(image.layer);
      stage.add(shapes.shapesLayer);
      stage.add(shapes.anchorsLayer);
      try {
        image.layer.getCanvas()._canvas.classList.add(IMAGE_LAYER_CLS);
        shapes.shapesLayer.getCanvas()._canvas.classList.add(SHAPES_LAYER_CLS);
        shapes.anchorsLayer
          .getCanvas()
          ._canvas.classList.add(ANCHORS_LAYER_CLS);
      } catch (e) {
        console.error("Can't set className to the canvas");
        console.error(e);
      }
      stage.on('mousedown', this.handleStageOnMouseDown);
      stage.on('mouseup', this.handleStageOnMouseUp);
      stage.on('mousemove', this.handleStageOnMouseMove);
      canvasStore.dispatch(setStage(stage));
      this.canvasRef.current.tabIndex = 1;
    }
  }

  private handleStageOnMouseDown = (e: any) => {
    const { shapes, stage } = canvasStore.getState() as TCanvasState;
    if (shapes.addingShapeRef && stage.instance) {
      const absPos = stage.instance.absolutePosition();
      const { layerX, layerY } = e.evt;
      const mouseStartPos = {
        x: layerX - absPos.x,
        y: layerY - absPos.y,
      };
      this.setState({
        mouseIsDown: true,
        mouseStartPos,
      });
      connectShape(shapes.addingShapeRef);
      shapes.addingShapeRef.initDraw(mouseStartPos, mouseStartPos);
    }
  };

  private handleStageOnMouseUp = () => {
    this.setState({ mouseIsDown: false });
    const { shapes } = canvasStore.getState() as TCanvasState;
    if (shapes.addingShapeRef) {
      canvasApi.shapeAdded(shapes.addingShapeRef);
      shapes.addingShapeRef.focus();
    }
    canvasStore.dispatch(setAddingShape(null));
    // I need to redraw shapes in order to focus to take effect.
    canvasStore.dispatch(drawLayers());
  };

  private handleStageOnMouseMove = (e: any) => {
    const { shapes, stage } = canvasStore.getState() as TCanvasState;
    if (this.state.mouseIsDown && shapes.addingShapeRef && stage.instance) {
      const absPos = stage.instance.absolutePosition();
      const { layerX, layerY } = e.evt;
      shapes.addingShapeRef.initDraw(this.state.mouseStartPos, {
        x: layerX - absPos.x,
        y: layerY - absPos.y,
      });
    }
  };

  private onClick = (e: any) => {
    if (this.canvasRef.current === e.target) {
      canvasStore.dispatch(blurShapes());
    }
  };

  render() {
    return (
      <CanvasWrapper>
        <KeyboardEvents />
        <div
          ref={this.canvasRef}
          className="canvas-el"
          onClick={this.onClick}
        />
      </CanvasWrapper>
    );
  }
}

// not using `connect()` see reason in the comment before class definition
export default CanvasEl;
