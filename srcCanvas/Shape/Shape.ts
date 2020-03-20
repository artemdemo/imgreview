/**
 * Base class for all shapes
 */

export type TScaleFactor = {
    wFactor: number;
    hFactor: number;
};

interface Shape {
    addToLayer(layer: any, opt?: any)

    setStrokeColor?(hex: string)
    getStrokeColor?(): string

    setFillColor?(hex: string)
    getFillColor?(): string

    on(key: string, cb)

    blur()
    focus()

    scale(factor: TScaleFactor)

    clone(): Shape

    destroy()

    isSelected(): boolean
}

export default Shape;
