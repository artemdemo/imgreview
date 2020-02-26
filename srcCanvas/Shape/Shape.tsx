/**
 * Base class for all shapes
 */

export type TScaleFactor = {
    wFactor: number;
    hFactor: number;
};

class Shape {
    public isSelected: boolean = false;

    addToStage(stage: any) {}

    setStrokeColor(hex: string) {}

    getStrokeColor() {}

    setStrokeWidth(width: number) {}

    blur() {}

    focus() {}

    scale(factor: TScaleFactor) {}

    clone() {
        return new Shape()
    }

    destroy() {}
}

export default Shape;
