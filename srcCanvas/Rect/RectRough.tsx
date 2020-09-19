/// <reference path="../../types/konva.d.ts" />

import Konva from 'konva';
import rough from 'roughjs';
import EShapeTypes from '../Shape/shapeTypes';
import Rect, {TRectProps} from '../Rect/Rect';
import {getShapesLayerEl} from '../CanvasEl/CanvasEl';
import * as roughService from '../services/rough';

class RectRough extends Rect {
    readonly type = EShapeTypes.ELLIPSE;

    readonly props: TRectProps;
    readonly #roughCanvas;
    shape: Konva.Shape;

    constructor(props: TRectProps) {
        super(props);
        this.props = {...props};
        const shapesCanvasEl = getShapesLayerEl();
        this.#roughCanvas = rough.canvas(shapesCanvasEl);
    }

    defineShape() {
        this.shape = new Konva.Shape({
            x: this.props.x || 0,
            y: this.props.y || 0,
            width: this.props.width || 0,
            height: this.props.height || 0,
            stroke: this.props.stroke,
            strokeWidth: this.props.strokeWidth / 2,
            fill: this.props.fill,
            draggable: true,
            sceneFunc: (context, shape) => {
                const drawable = this.#roughCanvas.generator.rectangle(
                    0,
                    0,
                    shape.getWidth(),
                    shape.getHeight(),
                    {
                        roughness: 2.5,
                        stroke: shape.getStroke(),
                    },
                );
                roughService.draw(context, drawable);
                context.fillStrokeShape(shape);
            }
        });
    }

    // clone(): RectRough {
    //
    // }
}

export default RectRough;
