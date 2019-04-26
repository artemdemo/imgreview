/**
 * Base class for all shapes
 */

class Shape {
    public isSelected: boolean = false;

    addToStage(stage: any) {}

    setStrokeColor(hex: string) {}

    setStrokeWidth(width: number) {}

    clearFocus() {}

    clone() {
        return new Shape();
    }

    destroy() {}
}

export default Shape;
