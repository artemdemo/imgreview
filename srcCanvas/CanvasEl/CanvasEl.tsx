import React from 'react';
import { TPos } from 'konva';
import { setAddingShape, drawLayers } from '../model/shapes/shapesActions';
import { connectShape } from '../addShape';
import { TCanvasState } from '../reducers';
import canvasStore from '../store';
import { setStage } from '../model/stage/stageActions';
import { setSaveStage } from '../model/saveCanvas/saveCanvasActions';
import { SHAPES_LAYER_CLS } from '../model/shapes/shapesConst';
import { KeyboardEvents } from './KeyboardEvents';
import { CanvasWrapper } from './CanvasWrapper';
import Stage from './Stage';
import { SaveStage } from './SaveStage';
import '../events/events';
import './CanvasEl.less';
import { SaveCanvasEl } from '../SaveCanvasEl/SaveCanvasEl';

export const getShapesLayerEl = (): HTMLCanvasElement => {
  const shapesLayerEl: HTMLCanvasElement | null = document.querySelector(
    `.${SHAPES_LAYER_CLS}`
  );
  if (shapesLayerEl) {
    return shapesLayerEl;
  }
  throw new Error(`Shapes layer is not found`);
};

type Props = {};

type State = {
  mouseIsDown: boolean;
  mouseStartPos: TPos;
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
      const stage = new Stage(this.canvasRef.current);
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
      const absPos = stage.instance.absolutePosition()!;
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
      shapes.addingShapeRef.focus();
    }
    canvasStore.dispatch(setAddingShape(null));
    // I need to redraw shapes in order to focus to take effect.
    canvasStore.dispatch(drawLayers());
  };

  private handleStageOnMouseMove = (e: any) => {
    const { shapes, stage } = canvasStore.getState() as TCanvasState;
    if (this.state.mouseIsDown && shapes.addingShapeRef && stage.instance) {
      const absPos = stage.instance.absolutePosition()!;
      const { layerX, layerY } = e.evt;
      shapes.addingShapeRef.initDraw(this.state.mouseStartPos, {
        x: layerX - absPos.x,
        y: layerY - absPos.y,
      });
    }
  };

  render() {
    return (
      <>
        <CanvasWrapper>
          <KeyboardEvents />
          <div ref={this.canvasRef} className="canvas-el" />
        </CanvasWrapper>
        <SaveCanvasEl />
      </>
    );
  }
}

// not using `connect()` see reason in the comment before class definition
export default CanvasEl;
