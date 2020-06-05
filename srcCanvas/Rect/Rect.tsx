/// <reference path="../../types/konva.d.ts" />

import Konva from "konva";
import IShape, { TScaleProps } from "../Shape/IShape";
import shapeTypes from "../Shape/shapeTypes";
import Shape from "../Shape/Shape";
import SizeTransform from "../SizeTransform/SizeTransform";
import * as number from "../services/number";

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

class Rect extends Shape implements IShape {
    type = shapeTypes.RECT;

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

        const defaultWidth = number.ensureBetween(
            300,
            layer.parent.attrs.width * 0.1,
            layer.parent.attrs.width * 0.2,
        );
        const defaultHeight = number.ensureBetween(
            200,
            layer.parent.attrs.height * 0.1,
            layer.parent.attrs.height * 0.2,
        );
        const defaultX = (layer.parent.attrs.width / 2) - (defaultWidth / 2);
        const defaultY = (layer.parent.attrs.height / 2) - (defaultHeight / 2);

        this.#rect = new Konva.Rect({
            x: this.#props.x || defaultX,
            y: this.#props.y || defaultY,
            width: this.#props.width || defaultWidth,
            height: this.#props.height || defaultHeight,
            dash: this.#props.dash,
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
        this.#shapesLayer.draw();
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

    destroy() {
        this.#rect.destroy();
        this.#sizeTransform.destroy();
        this.#shapesLayer.draw();
    }
}

export default Rect;
