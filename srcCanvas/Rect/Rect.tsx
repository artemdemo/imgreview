/// <reference path="../../types/konva.d.ts" />

import Konva from "konva";
import IShape, { TScaleProps } from "../Shape/IShape";
import shapeTypes from "../Shape/shapeTypes";
import Shape from "../Shape/Shape";
import IGeometricShape from "../Shape/IGeometricShape";

type TRectProps = {
    stroke: string;
    fill: string;
    strokeWidth: number;
};

class Rect extends Shape implements IGeometricShape {
    readonly type = shapeTypes.RECT;
    readonly #props: TRectProps;
    #shapesLayer: Konva.Layer;
    #rect: Konva.Rect;
    #transformer: Konva.Transformer;

    constructor(props: TRectProps) {
        super();
        this.#props = {...props};
    }

    setStrokeWidth(width: number) {
        throw new Error("Method not implemented.");
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
        });

        super.attachBasicEvents(this.#rect);

        this.#transformer = new Konva.Transformer({
            node: this.#rect,
            enabledAnchors: ['middle-left', 'middle-right', 'bottom-center', 'top-center'],
            borderStroke: '#2196f3',
            anchorStroke: '#2196f3',
            anchorFill: '#ffffff',
            borderStrokeWidth: 1,
            anchorStrokeWidth: 1,
        });

        this.focus();
        this.#shapesLayer.add(this.#rect);
        this.#shapesLayer.add(this.#transformer);
        this.#shapesLayer.draw();
    }

    blur() {
        super.blur();
        this.#transformer.hide();
        this.#shapesLayer.draw();
    }

    focus() {
        super.focus();
        this.#transformer.show();
        this.#transformer.forceUpdate();
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
    }
}

export default Rect;
