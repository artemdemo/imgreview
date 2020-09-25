/// <reference path="../../types/konva.d.ts" />

import Konva, {TPos} from 'konva';
import rough from 'roughjs';
import EShapeTypes from '../Shape/shapeTypes';
import Rect, {TRectProps} from '../Rect/Rect';
import {getShapesLayerEl} from '../CanvasEl/CanvasEl';
import * as roughService from '../services/rough';
import {TSizePosition} from '../SizeTransform/SizeTransformAnchorsGroup';

const ROUGHNESS = 2.5;

class RectRough extends Rect {
    readonly type = EShapeTypes.ELLIPSE;

    readonly props: TRectProps;
    readonly #roughCanvas;
    #lastDrawable;
    #isDragging: boolean = false;
    // `substrateRect` path used to receive mouse events.
    // It's useful since sketched rect will be draggable only on the edge.
    #substrateRect: Konva.Rect;
    shape: Konva.Shape;

    constructor(props: TRectProps) {
        super(props);
        this.props = {...props};
        const shapesCanvasEl = getShapesLayerEl();
        this.#roughCanvas = rough.canvas(shapesCanvasEl);
    }

    defineShape() {
        this.shape = new Konva.Shape({
            x: this.props.x || 0,
            y: this.props.y || 0,
            width: this.props.width || 0,
            height: this.props.height || 0,
            stroke: this.props.stroke,
            strokeWidth: this.props.strokeWidth / 2,
            fill: 'transparent',
            draggable: true,
            sceneFunc: (context, shape) => {
                const selected = this.isSelected() && !this.#isDragging;
                if (selected || !this.#lastDrawable) {
                    this.#lastDrawable = this.#roughCanvas.generator.rectangle(
                        0,
                        0,
                        shape.getWidth(),
                        shape.getHeight(),
                        {
                            roughness: ROUGHNESS,
                            stroke: shape.getStroke(),
                        },
                    );
                }
                roughService.draw(context, this.#lastDrawable);
                context.fillStrokeShape(shape);
            }
        });

        this.#substrateRect = new Konva.Rect({
            x: this.props.x || 0,
            y: this.props.y || 0,
            width: this.props.width || 0,
            height: this.props.height || 0,
            stroke: 'transparent',
            fill: 'transparent',
            draggable: true,
        });

        this.shape.on('dragstart', () => {
            this.#isDragging = true;
        });
        this.shape.on('dragend', () => {
            this.#isDragging = false;
        });

        this.#substrateRect.on('dragstart', () => {
            this.#isDragging = true;
        });
        this.#substrateRect.on('dragend', () => {
            this.#isDragging = false;
        });
        this.#substrateRect.on('click', (e) => {
            const clickCb = this.cbMap.get('click');
            clickCb && clickCb(this);
        });
        this.#substrateRect.on('dragstart', () => {
            const dragstartCb = this.cbMap.get('dragstart');
            dragstartCb && dragstartCb(this);
        });
        this.#substrateRect.on('mouseover', () => {
            const mouseoverCb = this.cbMap.get('mouseover');
            console.log(mouseoverCb);
            mouseoverCb && mouseoverCb();
        });
        this.#substrateRect.on('mouseout', () => {
            const mouseoutCb = this.cbMap.get('mouseout');
            mouseoutCb && mouseoutCb();
        });
    }

    addToLayer(shapesLayer: Konva.Layer, anchorsLayer: Konva.Layer) {
        super.addToLayer(shapesLayer, anchorsLayer);
        this.#substrateRect.on('dragmove', this.onDragMoveSubRect)
        shapesLayer.add(this.#substrateRect);
    }

    onDragMoveSubRect = (e) => {
        const dragmoveCb = this.cbMap.get('dragmove');
        dragmoveCb && dragmoveCb(e);
        const subRectPos = this.getSizePosSubRect();
        this.sizeTransform.update(subRectPos);
        this.shape.setAttrs(subRectPos);
    };

    onDragMoveAnchor = (data: TSizePosition) => {
        this.#substrateRect.setAttrs(data);
        this.setShapeAttrs(data);
    };

    getSizePosSubRect = (): TSizePosition => {
        const { x, y, width, height } = this.#substrateRect.getAttrs();
        return {
            x,
            y,
            width,
            height,
        };
    };

    draggable(value: boolean) {
        const result = super.draggable(value);
        this.#substrateRect.setAttr('draggable', value);
        return result;
    }

    initDraw(startPos: TPos, currentPos: TPos) {
        this.#substrateRect.setAttrs({
            x: startPos.x,
            y: startPos.y,
            width: currentPos.x - startPos.x,
            height: currentPos.y - startPos.y,
        });
        super.initDraw(startPos, currentPos);
    }

    // clone(): RectRough {
    //
    // }
}

export default RectRough;
