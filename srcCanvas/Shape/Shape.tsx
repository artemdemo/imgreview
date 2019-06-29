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

    setStrokeWidth(width: number) {}

    clearFocus() {}

    setFocus() {}

    scale(factor: TScaleFactor) {}

    clone() {
        return new Shape();
    }

    destroy() {}
}

export default Shape;
