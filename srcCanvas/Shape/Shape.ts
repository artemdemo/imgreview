/**
 * Base class for all shapes
 */

export type TScaleFactor = {
    wFactor: number;
    hFactor: number;
};

interface Shape {
    isSelected: boolean;

    addToLayer(layer: any, opt?: any)

    setStrokeColor(hex: string)

    getStrokeColor(): string

    on(key: string, cb)

    blur()

    focus()

    scale(factor: TScaleFactor)

    clone(): Shape

    destroy()
}

export default Shape;
