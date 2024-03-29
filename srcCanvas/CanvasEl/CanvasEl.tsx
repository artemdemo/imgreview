import React from 'react';
import {
  deleteShape,
  setAddingShape,
  shapeAdded,
} from '../model/shapes/shapesActions';
import { connectShape } from '../addShape';
import canvasStore from '../store';
import { setStage } from '../model/stage/stageActions';
import { SHAPES_LAYER_CLS } from '../model/shapes/shapesConst';
import { KeyboardEvents } from './KeyboardEvents';
import { CanvasWrapper } from './CanvasWrapper';
import Stage from './Stage';
import { SaveCanvasEl } from '../SaveCanvasEl/SaveCanvasEl';
import { distanceBetweenTwoPoints } from '../services/number';
import EShapeTypes from '../canvasShapes/Shape/shapeTypes';
import { applyInitDraw } from './ratioPos';
import { canvasApiFactory } from '../api/canvasApiFactory';
import { CanvasAPI } from '../api/api-types';
import s from './CanvasEl.module.css';
import { querySelector } from '../../src/services/document';
import { TPos } from '../custom';

export const getShapesLayerEl = (): HTMLCanvasElement => {
  const shapesLayerEl = querySelector<HTMLCanvasElement>(
    `.${SHAPES_LAYER_CLS}`,
  );
  if (shapesLayerEl) {
    return shapesLayerEl;
  }
  throw new Error(`Shapes layer is not found`);
};

const MIN_CLICK_DISTANCE = 10;

type Props = {
  onReady: (canvasApi: CanvasAPI) => void;
};

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
      this.props.onReady(canvasApiFactory());
    }
  }

  private handleStageOnMouseDown = (e: any) => {
    const { shapes, stage } = canvasStore.getState();
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

  private handleStageOnMouseUp = (e: any) => {
    this.setState({ mouseIsDown: false });
    const { shapes, stage } = canvasStore.getState();
    if (shapes.addingShapeRef) {
      const absPos = stage.instance!.absolutePosition()!;
      const { layerX, layerY } = e.evt;
      const clickDistance = distanceBetweenTwoPoints(
        {
          x: layerX - absPos.x,
          y: layerY - absPos.y,
        },
        this.state.mouseStartPos,
      );

      // Text can be added without checking minimum distance,
      // since there is default text, and it will be anyway visible.
      if (
        shapes.addingShapeRef.type === EShapeTypes.TEXT ||
        clickDistance > MIN_CLICK_DISTANCE
      ) {
        shapes.addingShapeRef.focus();
        canvasStore.dispatch(shapeAdded(shapes.addingShapeRef));
      } else {
        canvasStore.dispatch(deleteShape(shapes.addingShapeRef));
      }
      // Delaying clearance of `addingShapeRef` (empty `setAddingShape()` will clear it)
      // So click handlers in Stage.tsx and Shape.tsx could address it.
      requestAnimationFrame(() => {
        canvasStore.dispatch(setAddingShape());
      });
    }
  };

  private handleStageOnMouseMove = (e: any) => {
    const { shapes, stage } = canvasStore.getState();
    if (this.state.mouseIsDown && shapes.addingShapeRef && stage.instance) {
      const absPos = stage.instance.absolutePosition()!;
      const { layerX, layerY } = e.evt;
      applyInitDraw({
        shape: shapes.addingShapeRef,
        startPos: this.state.mouseStartPos,
        currentPos: {
          x: layerX - absPos.x,
          y: layerY - absPos.y,
        },
        ratioShiftIsActive: stage.ratioShiftIsActive,
      });
    }
  };

  render() {
    return (
      <>
        <CanvasWrapper>
          <KeyboardEvents />
          <div ref={this.canvasRef} className={s.CanvasEl} />
        </CanvasWrapper>
        <SaveCanvasEl />
      </>
    );
  }
}

// not using `connect()` see reason in the comment before class definition
export default CanvasEl;
