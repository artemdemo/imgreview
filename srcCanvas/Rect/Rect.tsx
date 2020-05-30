/// <reference path="../../types/konva.d.ts" />

import Konva from "konva";
import IShape, { TScaleProps } from "../Shape/IShape";
import shapeTypes from "../Shape/shapeTypes";
import Shape from "../Shape/Shape";
import IGeometricShape from "../Shape/IGeometricShape";
import SizeTransform from "../SizeTransform/SizeTransform";

type TRectProps = {
    stroke: string;
    fill: string;
    strokeWidth: number;
    x?: number;
    y?: number;
};

class Rect extends Shape implements IGeometricShape {
    readonly type = shapeTypes.RECT;
    readonly #props: TRectProps;
    #shapesLayer: Konva.Layer;
    #rect: Konva.Rect;
    #sizeTransform: SizeTransform;

    constructor(props: TRectProps) {
        super();
        this.#props = {...props};
    }

    setStrokeWidth(width: number) {
        throw new Error('Method not implemented.');
    }

    addToLayer(layer: Konva.Layer) {
        this.#shapesLayer = layer;

        const width = layer.parent.attrs.width * 0.8;
        const height = layer.parent.attrs.height * 0.8;

        this.#rect = new Konva.Rect({
            x: (layer.parent.attrs.width / 2) - (width / 2),
            y: (layer.parent.attrs.height / 2) - (height / 2),
            width,
            height,
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

    clone(): IShape {
        return new Rect({
            ...this.#props,
        });
    }

    destroy() {
        this.#rect.destroy();
        this.#sizeTransform.destroy();
    }
}

export default Rect;
