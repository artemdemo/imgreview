/// <reference path="../../types/konva.d.ts" />

import Konva, {TPos} from 'konva';
import {TScaleProps} from '../Shape/IShape';
import EShapeTypes from '../Shape/shapeTypes';
import Shape from '../Shape/Shape';
import SizeTransform from '../SizeTransform/SizeTransform';
import {TSizePosition} from '../SizeTransform/SizeTransformAnchorsGroup';
import IGeometricShape from '../Shape/IGeometricShape';
import {drawShapesLayer} from '../model/shapes/shapesActions';
import store from '../store';

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

    readonly props: TRectProps;
    shape: Konva.Rect;
    sizeTransform: SizeTransform;

    constructor(props: TRectProps) {
        super();
        this.props = {...props};
    }

    private onDragMove = (e) => {
        const dragmoveCb = this.cbMap.get('dragmove');
        dragmoveCb && dragmoveCb(e);
        this.sizeTransform.update(this.getSizePos());
    };

    getSizePos = (): TSizePosition => {
        const { x, y, width, height } = this.getAttrs();
        return {
            x,
            y,
            width,
            height,
        };
    };

    onDragMoveAnchor = (data: TSizePosition) => {
        this.setShapeAttrs(data);
    };

    defineShape() {
        this.shape = new Konva.Rect({
            x: this.props.x || 0,
            y: this.props.y || 0,
            width: this.props.width || 0,
            height: this.props.height || 0,
            dash: this.props.dash,
            stroke: this.props.stroke,
            strokeWidth: this.props.strokeWidth,
            fill: this.props.fill,
            draggable: true,
        });
    }

    addToLayer(shapesLayer: Konva.Layer, anchorsLayer: Konva.Layer) {
        super.addToLayer(shapesLayer, anchorsLayer);

        this.defineShape();
        this.shape.on('dragmove', this.onDragMove);

        super.attachBasicEvents(this.shape);

        this.sizeTransform = new SizeTransform(this.getSizePos());
        this.sizeTransform.on('dragmoveanchor', this.onDragMoveAnchor);

        this.focus();
        shapesLayer.add(this.shape)
        this.sizeTransform.addToLayer(anchorsLayer);
    }

    blur() {
        super.blur();
        this.sizeTransform.hide();
    }

    focus() {
        super.focus();
        this.sizeTransform.show();
    }

    getFillColor(): string {
        return this.props.fill;
    }

    setFillColor(hex: string) {
        this.shape.setAttr('fill', hex);
    }

    getStrokeColor(): string {
        return this.props.stroke;
    }

    getAttrs() {
        return this.shape.getAttrs();
    }

    // `setShapeAttrs` is meant to be used after moving anchors.
    // This way it will only update rectangle, without causing double loop of updates:
    // from anchor to shape and backwards.
    setShapeAttrs(attrs) {
        this.shape.setAttrs(attrs);
    }

    // `setAttrs` is meant to be used after moving the whole Rect as group (incl anchors)
    // Therefore after it I need to update everything.
    setAttrs(attrs) {
        this.setShapeAttrs(attrs);
        this.sizeTransform.update(this.getSizePos());
        store.dispatch(drawShapesLayer());
    }

    setStrokeColor(hex: string) {
        this.setShapeAttrs({
            stroke: hex,
        });
    }

    setStrokeWidth(strokeWidth: number) {
        this.setShapeAttrs({ strokeWidth });
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
        const attrs = this.shape?.getAttrs();
        return new Rect({
            ...this.props,
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
        if (this.type === EShapeTypes.RECT) {
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
        this.shape.destroy();
        this.sizeTransform.destroy();
    }
}

export default Rect;
