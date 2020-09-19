/// <reference path="../../types/konva.d.ts" />

import Konva from 'konva';
import rough from 'roughjs';
import EShapeTypes from '../Shape/shapeTypes';
import Rect, {TRectProps} from '../Rect/Rect';
import {getShapesLayerEl} from '../CanvasEl/CanvasEl';
import * as roughService from '../services/rough';

const ROUGHNESS = 2.5;

class RectRough extends Rect {
    readonly type = EShapeTypes.ELLIPSE;

    readonly props: TRectProps;
    readonly #roughCanvas;
    #lastDrawable;
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
            fill: 'transparent',
            sceneFunc: (context, shape) => {
                if (this.isSelected() || !this.#lastDrawable) {
                    this.#lastDrawable = this.#roughCanvas.generator.rectangle(
                        0,
                        0,
                        shape.getWidth(),
                        shape.getHeight(),
                        {
                            roughness: ROUGHNESS,
                            stroke: shape.getStroke(),
                        },
                    );
                }
                roughService.draw(context, this.#lastDrawable);
                context.fillStrokeShape(shape);
            }
        });
    }

    // clone(): RectRough {
    //
    // }
}

export default RectRough;
