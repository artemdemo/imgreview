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

    /**
     * This method will be triggered after cropping the canvas.
     * @param cropFramePosition
     */
    crop(cropFramePosition: TPos)

    /**
     * This method will be triggered to change shape size after scaling the canvas.
     * @param scaleProps
     */
    scale(scaleProps: TScaleProps)

    /**
     * This method will be used only for initial "click and draw" of the shape.
     * @param startPos
     * @param currentPos
     */
    initDraw(startPos: TPos, currentPos: TPos)

    clone(): IShape

    destroy()

    isSelected(): boolean

    isConnected(): boolean
}

export default IShape;
