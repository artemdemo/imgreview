import Konva from "konva";
import shapeTypes from "./shapeTypes";
import {TCoordinate} from "../Arrow/arrowTypes";

export type TScaleProps = {
    wFactor: number;
    hFactor: number;
    stagePosition: {
        left: number;
        top: number;
    };
};

interface IShape {
    type: shapeTypes;

    addToLayer(layer: Konva.Layer, opt?: any)

    setStrokeColor?(hex: string)
    getStrokeColor?(): string

    setFillColor?(hex: string)
    getFillColor?(): string

    on(key: string, cb)

    blur()
    focus()

    crop(cropFramePosition: TCoordinate)

    scale(scaleProps: TScaleProps)

    clone(): IShape

    destroy()

    isSelected(): boolean
}

export default IShape;
