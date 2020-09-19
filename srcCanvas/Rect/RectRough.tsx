import rough from 'roughjs';
import _pickBy from 'lodash/pickBy';
import _identity from 'lodash/identity';
import { getRoughShapesLayerEl } from '../CanvasEl/CanvasEl';

type TAttrs = {
    x: number;
    y: number;
    width: number;
    height: number;
    stroke: string;
    strokeWidth: number;
};

type TOptionalAttrs = {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    stroke?: string;
    strokeWidth?: number;
};

class RectRough {
    props: TAttrs;
    readonly #roughCanvas;

    constructor(attrs: TAttrs) {
        const shapesCanvasEl = getRoughShapesLayerEl();
        this.#roughCanvas = rough.canvas(shapesCanvasEl);
        this.draw(attrs);
    }

    setAttrs(attrs: TOptionalAttrs) {
        this.draw({
            ...this.props,
            ..._pickBy(attrs, _identity),
        });
    }

    draw(attrs?: TAttrs) {
        if (attrs) {
            this.props = {
                ...this.props,
                ..._pickBy(attrs, _identity),
            };
        }

        this.#roughCanvas.rectangle(
            this.props.x,
            this.props.y,
            this.props.width,
            this.props.height,
            {
                roughness: 2.5,
                stroke: this.props.stroke,
                strokeWidth: this.props.strokeWidth / 2,
            },
        );
    }
}

export default RectRough;
