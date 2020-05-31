/// <reference path="../../types/konva.d.ts" />

import Konva from "konva";
import IShape, { TScaleProps } from "../Shape/IShape";
import shapeTypes from "../Shape/shapeTypes";
import Shape from "../Shape/Shape";
import SizeTransform from "../SizeTransform/SizeTransform";

type TRectProps = {
    stroke: string;
    fill: string;
    strokeWidth: number;
    width?: number;
    height?: number;
    x?: number;
    y?: number;
};

class Rect extends Shape implements IShape {
    readonly type = shapeTypes.RECT;

    readonly #props: TRectProps;
    #shapesLayer: Konva.Layer;
    #rect: Konva.Rect;
    #sizeTransform: SizeTransform;

    constructor(props: TRectProps) {
        super();
        this.#props = {...props};
    }

    addToLayer(layer: Konva.Layer) {
        this.#shapesLayer = layer;

        const defaultWidth = layer.parent.attrs.width * 0.8;
        const defaultHeight = layer.parent.attrs.height * 0.8;
        const defaultX = (layer.parent.attrs.width / 2) - (defaultWidth / 2);
        const defaultY = (layer.parent.attrs.height / 2) - (defaultHeight / 2);

        this.#rect = new Konva.Rect({
            x: this.#props.x || defaultX,
            y: this.#props.y || defaultY,
            width: this.#props.width || defaultWidth,
            height: this.#props.height || defaultHeight,
            stroke: this.#props.stroke,
            strokeWidth: this.#props.strokeWidth,
            fill: this.#props.fill,
            draggable: true,
        });
        this.#rect.on('dragmove', this.onDragMove);

        super.attachBasicEvents(this.#rect);

        this.#sizeTransform = new SizeTransform(this);

        this.focus();
        this.#shapesLayer.add(this.#rect);
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
        this.#rect.setAttr('fill', hex);
    }

    getStrokeColor(): string {
        return this.#props.stroke;
    }

    getAttrs() {
        return this.#rect.getAttrs();
    }

    setAttrs(attrs) {
        this.#rect.setAttrs(attrs);
    }

    setStrokeColor(hex: string) {
        this.#rect.setAttr('stroke', hex);
    }

    scale(scaleProps: TScaleProps) {
    }

    clone(): Rect {
        const { x, y, width, height, stroke, strokeWidth } = this.#rect.getAttrs();
        return new Rect({
            ...this.#props,
            x,
            y,
            width,
            height,
            stroke,
            strokeWidth,
        });
    }

    destroy() {
        this.#rect.destroy();
        this.#sizeTransform.destroy();
        this.#shapesLayer.draw();
    }
}

export default Rect;
