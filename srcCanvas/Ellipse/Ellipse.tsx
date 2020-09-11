/// <reference path="../../types/konva.d.ts" />

import Konva, {TPos} from 'konva';
import IShape, {TScaleProps} from '../Shape/IShape';
import shapeTypes from '../Shape/shapeTypes';
import Shape from '../Shape/Shape';
import SizeTransform from '../SizeTransform/SizeTransform';

export type TEllipseProps = {
    stroke: string;
    fill: string;
    strokeWidth: number;
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    dash?: number[];
};

class Ellipse extends Shape implements IShape {
    type = shapeTypes.ELLIPSE;

    readonly #props: TEllipseProps;
    #shapesLayer: Konva.Layer;
    #ellipse: Konva.Rect;
    #sizeTransform: SizeTransform;

    constructor(props: TEllipseProps) {
        super();
        this.#props = {...props};
    }

    addToLayer(layer: Konva.Layer) {
        super.addToLayer(layer);
        this.#shapesLayer = layer;

        this.#ellipse = new Konva.Ellipse({
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
        this.#ellipse.on('dragmove', this.onDragMove);

        super.attachBasicEvents(this.#ellipse);

        this.#sizeTransform = new SizeTransform(this);

        this.focus();
        this.#shapesLayer.add(this.#ellipse);
        this.#sizeTransform.addToLayer(this.#shapesLayer);
        this.#shapesLayer.draw();
    }

    private onDragMove = (e) => {
        const dragmoveCb = this.cbMap.get('dragmove');
        dragmoveCb && dragmoveCb(e);
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
        this.#ellipse.setAttr('fill', hex);
    }

    getStrokeColor(): string {
        return this.#props.stroke;
    }

    getAttrs() {
        return this.#ellipse.getAttrs();
    }

    // `setShapeAttrs` is meant to be used after moving anchors.
    // This way it will only update rectangle, without causing double loop of updates:
    // from anchor to shape and backwards.
    setShapeAttrs(attrs) {
        this.#ellipse.setAttrs(attrs);
        this.#shapesLayer.draw();
    }

    // `setAttrs` is meant to be used after moving the whole Rect as group (incl anchors)
    // Therefore after it I need to update everything.
    setAttrs(attrs) {
        this.setShapeAttrs(attrs);
        this.#shapesLayer.draw();
        this.#sizeTransform.update();
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

    clone(): Ellipse {
        const attrs = this.#ellipse?.getAttrs();
        return new Ellipse({
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
        this.blur();
        const width = currentPos.x - startPos.x;
        const height = currentPos.y - startPos.y;
        this.setAttrs({
            x: startPos.x + (width / 2),
            y: startPos.y + (height / 2),
            width,
            height,
        });
    }

    destroy() {
        this.#ellipse.destroy();
        this.#sizeTransform.destroy();
        this.#shapesLayer.draw();
    }
}

export default Ellipse;
