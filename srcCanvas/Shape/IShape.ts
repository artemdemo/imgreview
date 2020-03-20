/**
 * Base class for all shapes
 */

export type TScaleFactor = {
    wFactor: number;
    hFactor: number;
};

interface IShape {
    addToLayer(layer: any, opt?: any)

    setStrokeColor?(hex: string)
    getStrokeColor?(): string

    setFillColor?(hex: string)
    getFillColor?(): string

    on(key: string, cb)

    blur()
    focus()

    scale(factor: TScaleFactor)

    clone(): IShape

    destroy()

    isSelected(): boolean
}

export default IShape;
