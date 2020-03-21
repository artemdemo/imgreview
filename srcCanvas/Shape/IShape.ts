/**
 * Base class for all shapes
 */
import shapeTypes from './shapeTypes';

export type TScaleProps = {
    wFactor: number;
    hFactor: number;
    stagePosition: {
        left: number;
        top: number;
    };
};

interface IShape {
    readonly type: shapeTypes;
    addToLayer(layer: any, opt?: any)

    setStrokeColor?(hex: string)
    getStrokeColor?(): string

    setFillColor?(hex: string)
    getFillColor?(): string

    on(key: string, cb)

    blur()
    focus()

    scale(scaleProps: TScaleProps)

    clone(): IShape

    destroy()

    isSelected(): boolean
}

export default IShape;
