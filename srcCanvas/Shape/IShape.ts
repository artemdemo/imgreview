import Konva, {TPos} from "konva";
import shapeTypes from "./shapeTypes";

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

    crop(cropFramePosition: TPos)

    scale(scaleProps: TScaleProps)

    clone(): IShape

    destroy()

    isSelected(): boolean

    isConnected(): boolean
}

export default IShape;
