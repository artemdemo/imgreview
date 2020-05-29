/// <reference path="../../types/konva.d.ts" />

import Konva from "konva";
import IShape, { TScaleProps } from "../Shape/IShape";
import * as api from "../api";
import shapeTypes from "../Shape/shapeTypes";

type TRectProps = {
    stroke: string;
    fill: string;
    strokeWidth: number;
};

class Rect implements IShape {
    readonly type = shapeTypes.RECT;
    readonly #props: TRectProps;
    readonly #cbMap: Map<string, (e?: any) => void>;
    #shapesLayer: Konva.Layer;
    #rect: Konva.Rect;
    #isSelected: boolean = false;

    constructor(props: TRectProps) {
        this.#props = {...props};
        this.#cbMap = new Map();
    }

    private onClick = (e) => {
        api.shapeClicked(this);
        e.cancelBubble = true;
        this.#isSelected = true;
        const clickCb = this.#cbMap.get('click');
        clickCb && clickCb(this);
    };

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
    }

    blur() {
        this.#isSelected = false;
    }

    focus() {
        this.#isSelected = true;
    }

    getFillColor(): string {
        return "";
    }

    getStrokeColor(): string {
        return "";
    }

    isSelected(): boolean {
        return this.#isSelected;
    }

    on(key: string, cb) {
        this.#cbMap.set(key, cb);
    }

    scale(scaleProps: TScaleProps) {
    }

    setFillColor(hex: string) {
    }

    setStrokeColor(hex: string) {
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
