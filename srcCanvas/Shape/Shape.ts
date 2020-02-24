/**
 * Base class for all shapes
 */

export type TScaleFactor = {
    wFactor: number;
    hFactor: number;
};

class Shape {
    public isSelected: boolean = false;

    addToLayer(layer: any, opt?: any) {}

    setStrokeColor(hex: string) {}

    getStrokeColor() {}

    blur() {}

    focus() {}

    scale(factor: TScaleFactor) {}

    clone() {
        return new Shape()
    }

    destroy() {}
}

export default Shape;
