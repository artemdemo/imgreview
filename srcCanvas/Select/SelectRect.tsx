import Rect, { TRectProps } from "../Rect/Rect";
import shapeTypes from "../Shape/shapeTypes";

class SelectRect extends Rect {
    constructor(props?: TRectProps) {
        super({
            ...props,
            stroke: '#0d87dc',
            fill: 'transparent',
            strokeWidth: 2,
            dash: [10, 5],
        });
        this.type = shapeTypes.SELECT_RECT;
    }

    blur() {
        super.blur();
        this.destroy();
    }

    scale() {
        this.destroy();
    }
}

export default SelectRect;
