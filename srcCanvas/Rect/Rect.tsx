/// <reference path="../../types/konva.d.ts" />

import Konva, {TPos} from 'konva';
import {TScaleProps} from '../Shape/IShape';
import EShapeTypes from '../Shape/shapeTypes';
import Shape from '../Shape/Shape';
import SizeTransform from '../SizeTransform/SizeTransform';
import {TSizePosition} from '../SizeTransform/SizeTransformAnchorsGroup';
import IGeometricShape from '../Shape/IGeometricShape';

export type TRectProps = {
    stroke: string;
    fill: string;
    strokeWidth: number;
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    dash?: number[];
};

class Rect extends Shape implements IGeometricShape {
    type = EShapeTypes.RECT;

    readonly #props: TRectProps;
    #shapesLayer: Konva.Layer;
    #rect: Konva.Rect;
    #sizeTransform: SizeTransform;

    constructor(props: TRectProps) {
        super();
        this.#props = {...props};
    }

    addToLayer(layer: Konva.Layer) {
        super.addToLayer(layer);
        this.#shapesLayer = layer;

        this.#rect = new Konva.Rect({
            x: this.#props.x || 0,
            y: this.#props.y || 0,
            width: this.#props.width || 0,
            height: this.#props.height || 0,
            dash: this.#props.dash,
            stroke: this.#props.stroke,
            strokeWidth: this.#props.strokeWidth,
            fill: this.#props.fill,
            draggable: true,
        });
        this.#rect.on('dragmove', this.onDragMove);

        super.attachBasicEvents(this.#rect);

        this.#sizeTransform = new SizeTransform(this.getSizePos());
        this.#sizeTransform.on('dragmoveanchor', this.onDragMoveAnchor);

        this.focus();
        this.#shapesLayer.add(this.#rect);
        this.#sizeTransform.addToLayer(this.#shapesLayer);
        this.#shapesLayer.draw();
    }

    private onDragMove = (e) => {
        const dragmoveCb = this.cbMap.get('dragmove');
        dragmoveCb && dragmoveCb(e);
        this.#sizeTransform.update(this.getAttrs());
    };

    private onDragMoveAnchor = (data: TSizePosition) => {
        this.setShapeAttrs(data);
    };

    private getSizePos = (): TSizePosition => {
        const { x, y, width, height } = this.getAttrs();
        return {
            x,
            y,
            width,
            height,
        };
    };

    blur() {
        super.blur();
        this.#sizeTransform.hide();
        this.#shapesLayer.draw();
    }

    focus() {
        super.focus();
        this.#sizeTransform.show();
        this.#shapesLayer.draw();
    }

    getFillColor(): string {
        return this.#props.fill;
    }

    setFillColor(hex: string) {
        this.#rect.setAttr('fill', hex);
    }

    getStrokeColor(): string {
        return this.#props.stroke;
    }

    getAttrs() {
        return this.#rect.getAttrs();
    }

    // `setShapeAttrs` is meant to be used after moving anchors.
    // This way it will only update rectangle, without causing double loop of updates:
    // from anchor to shape and backwards.
    setShapeAttrs(attrs) {
        this.#rect.setAttrs(attrs);
        this.#shapesLayer.draw();
    }

    // `setAttrs` is meant to be used after moving the whole Rect as group (incl anchors)
    // Therefore after it I need to update everything.
    setAttrs(attrs) {
        this.setShapeAttrs(attrs);
        this.#shapesLayer.draw();
        this.#sizeTransform.update(this.getSizePos());
    }

    setStrokeColor(hex: string) {
        this.setAttrs({
            stroke: hex,
        });
    }

    setStrokeWidth(strokeWidth: number) {
        this.setAttrs({ strokeWidth });
    }

    scale(scaleProps: TScaleProps) {
        const { x, y, width, height } = this.getAttrs();
        this.setAttrs({
            x: x * scaleProps.wFactor,
            y: y * scaleProps.hFactor,
            width: width * scaleProps.wFactor,
            height: height * scaleProps.hFactor,
        })
    }

    crop(cropFramePosition: TPos) {
        const { x, y } = this.getAttrs();
        this.setAttrs({
            x: x - cropFramePosition.x,
            y: y - cropFramePosition.y,
        })
    }

    clone(): Rect {
        const attrs = this.#rect?.getAttrs();
        return new Rect({
            ...this.#props,
            ...(attrs && {
                x: attrs.x,
                y: attrs.y,
                width: attrs.width,
                height: attrs.height,
                stroke: attrs.stroke,
                strokeWidth: attrs.strokeWidth,
            }),
        });
    }

    initDraw(startPos: TPos, currentPos: TPos) {
        // This class is extended by SelectRect.
        // And in case of SelectRect I don't want to blur() since it will destroy it.
        if (this.isSelected() && this.type === EShapeTypes.RECT) {
            this.blur();
        }
        this.setAttrs({
            x: startPos.x,
            y: startPos.y,
            width: currentPos.x - startPos.x,
            height: currentPos.y - startPos.y,
        });
    }

    destroy() {
        this.#rect.destroy();
        this.#sizeTransform.destroy();
        this.#shapesLayer.draw();
    }
}

export default Rect;
