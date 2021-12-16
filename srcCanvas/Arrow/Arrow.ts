import Konva, { TPos } from 'konva';
import _ from 'lodash';
import { TScaleProps } from '../Shape/IShape';
import IGeometricShape from '../Shape/IGeometricShape';
import AnchorsGroup from './AnchorsGroup';
import ArrowHead from './ArrowHead';
import { IAnchorsPosition } from './arrowTypes';
import shapeTypes from '../Shape/shapeTypes';
import Shape from '../Shape/Shape';
import { drawLayers } from '../model/shapes/shapesActions';
import store from '../store';

type TArrowProps = {
  stroke: string;
  strokeWidth?: number;
  anchorsPosition?: IAnchorsPosition;
};

const STROKE_COLOR = 'red';
const MAX_ARROW_LEN = 300;

class Arrow extends Shape implements IGeometricShape {
  type = shapeTypes.ARROW;

  readonly #props: TArrowProps;
  readonly #anchorsGroup: AnchorsGroup;

  // `substratePath` path used to receive mouse events.
  // It's useful for thin paths, when it's hard to "catch" them.
  #substratePath: Konva.Path | undefined;
  #visiblePath: Konva.Path | undefined;
  #arrowHead: ArrowHead | undefined;

  constructor(props: TArrowProps) {
    super();
    this.#props = { ...props };

    this.#anchorsGroup = new AnchorsGroup(this.#props.anchorsPosition);
  }

  private initArrowDraw(pathStr: string, layer: Konva.Layer) {
    this.#substratePath = new Konva.Path({
      data: pathStr,
      stroke: 'transparent',
      strokeWidth: 12,
      draggable: true,
    });
    this.#visiblePath = new Konva.Path({
      data: pathStr,
      stroke: this.#props.stroke || STROKE_COLOR,
      strokeWidth: this.#props.strokeWidth,
      lineCap: 'round',
      lineJoin: 'round',
    });
    this.#substratePath.on('dragmove', this.pathMove);

    this.attachBasicEvents(this.#substratePath);

    layer.add(this.#visiblePath);
    layer.add(this.#substratePath);
  }

  private getPathString(anchorsPosition: IAnchorsPosition) {
    const qPathX = _.get(this.#visiblePath, 'attrs.x', 0);
    const qPathY = _.get(this.#visiblePath, 'attrs.y', 0);

    return (
      `M${anchorsPosition.start.x - qPathX},${
        anchorsPosition.start.y - qPathY
      } ` +
      `Q${anchorsPosition.control.x - qPathX},${
        anchorsPosition.control.y - qPathY
      } ` +
      `${anchorsPosition.end.x - qPathX},${anchorsPosition.end.y - qPathY}`
    );
  }

  private redrawArrow = (redrawLayer: boolean = false) => {
    const anchorsPosition = this.#anchorsGroup.getPositions();
    const pathStr = this.getPathString(anchorsPosition);

    this.#visiblePath?.setData(pathStr);
    this.#substratePath?.setData(pathStr);

    this.#arrowHead?.update(
      anchorsPosition.start,
      anchorsPosition.control,
      this.#props.strokeWidth!
    );
    if (redrawLayer) {
      store.dispatch(drawLayers());
    }
  };

  private pathMove = () => {
    if (!this.#substratePath) {
      throw new Error('`this.#substratePath` is not defined');
    }

    const qPathX = this.#substratePath.attrs.x;
    const qPathY = this.#substratePath.attrs.y;

    this.#anchorsGroup.setDelta(qPathX, qPathY);
    this.#visiblePath?.setAttrs({
      x: qPathX,
      y: qPathY,
    });
    this.#arrowHead?.setDelta(qPathX, qPathY);

    this.#arrowHead?.draw();
    this.#anchorsGroup.draw();
  };

  blur = () => {
    super.blur();
    this.#anchorsGroup.visible(false);
  };

  focus() {
    super.focus();
    this.#anchorsGroup.visible(true);
  }

  onAnchor = (key: string, cb: (...rest: any) => void) => {
    this.#anchorsGroup.on(key, cb);
  };

  addToLayer(shapesLayer: Konva.Layer, anchorsLayer: Konva.Layer) {
    super.addToLayer(shapesLayer, anchorsLayer);

    // First I'm defining anchors in order to use them for creating the ArrowHead
    this.#anchorsGroup.setAnchors(
      {
        width: shapesLayer.parent.attrs.width,
        height: shapesLayer.parent.attrs.height,
      },
      MAX_ARROW_LEN
    );
    this.#anchorsGroup.on('dragmove', () => this.redrawArrow(true));
    this.#anchorsGroup.on('dragend', () => this.redrawArrow(true));

    const anchorsPosition = this.#anchorsGroup.getPositions();
    this.#arrowHead = new ArrowHead({
      start: anchorsPosition.start,
      control: anchorsPosition.control,
      stroke: this.#props.stroke || STROKE_COLOR,
      strokeWidth: this.#props.strokeWidth,
    });
    this.#arrowHead.on('click', this.onClick);

    const pathStr = this.getPathString(anchorsPosition);
    this.initArrowDraw(pathStr, shapesLayer);

    this.#arrowHead.addToLayer(shapesLayer);
    this.#anchorsGroup.addToLayer(anchorsLayer);

    this.redrawArrow();
  }

  /**
   * Set color of the arrow
   * @param hex {string}
   */
  setStrokeColor(hex: string) {
    this.#visiblePath?.setAttr('stroke', hex);
    this.#arrowHead?.setAttr('stroke', hex);

    // Updating props, I'll need it if user will clone Arrow
    this.#props.stroke = hex;

    this.#visiblePath?.draw();
    this.#arrowHead?.draw();
  }

  getStrokeColor() {
    return this.#props.stroke;
  }

  /**
   * Set width of the arrow
   * @param width {number}
   */
  setStrokeWidth(width: number) {
    this.#visiblePath?.setAttr('strokeWidth', width);

    // Updating props, I'll need it if user will clone Arrow
    this.#props.strokeWidth = width;

    this.redrawArrow();
  }

  getStrokeWidth(): number {
    return this.#visiblePath?.getAttr('strokeWidth');
  }

  draggable(value: boolean): boolean {
    this.#substratePath?.setAttr('draggable', value);
    return this.#substratePath?.getAttr('draggable');
  }

  scale(factor: TScaleProps) {
    const positions = this.#anchorsGroup.getPositions();
    this.#anchorsGroup.setAnchorsCoordinates({
      start: {
        x: positions.start.x * factor.wFactor,
        y: positions.start.y * factor.hFactor,
      },
      control: {
        x: positions.control.x * factor.wFactor,
        y: positions.control.y * factor.hFactor,
      },
      end: {
        x: positions.end.x * factor.wFactor,
        y: positions.end.y * factor.hFactor,
      },
    });

    this.redrawArrow();
  }

  initDraw(startPos: TPos, currentPos: TPos) {
    if (this.isSelected()) {
      this.blur();
    }
    this.#anchorsGroup.setAnchorsCoordinates({
      start: {
        x: currentPos.x,
        y: currentPos.y,
      },
      control: {
        x: (startPos.x + currentPos.x) / 2,
        y: (startPos.y + currentPos.y) / 2,
      },
      end: {
        x: startPos.x,
        y: startPos.y,
      },
    });

    this.redrawArrow(true);
  }

  crop(cropFramePosition: TPos) {
    const positions = this.#anchorsGroup.getPositions();
    this.#anchorsGroup.setAnchorsCoordinates({
      start: {
        x: positions.start.x - cropFramePosition.x,
        y: positions.start.y - cropFramePosition.y,
      },
      control: {
        x: positions.control.x - cropFramePosition.x,
        y: positions.control.y - cropFramePosition.y,
      },
      end: {
        x: positions.end.x - cropFramePosition.x,
        y: positions.end.y - cropFramePosition.y,
      },
    });

    this.redrawArrow();
  }

  clone() {
    const anchorsPosition = this.#anchorsGroup
      ? this.#anchorsGroup.getPositions()
      : this.#props.anchorsPosition;
    return new Arrow({
      ...this.#props,
      anchorsPosition,
    });
  }

  /**
   * Remove and destroy a shape. Kill it forever! You should not reuse node after destroy().
   */
  destroy() {
    super.destroy();
    this.#visiblePath?.destroy();
    this.#substratePath?.destroy();
    this.#arrowHead?.destroy();
    this.#anchorsGroup?.destroy();
  }
}

export default Arrow;
