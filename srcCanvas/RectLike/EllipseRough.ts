/// <reference path="../../types/konva.d.ts" />

import Konva from 'konva';
import rough from 'roughjs';
import EShapeTypes from '../Shape/shapeTypes';
import {TRectProps} from './Rect';
import RectRough from './RectRough';
import {getShapesLayerEl} from '../CanvasEl/CanvasEl';
import * as roughService from '../services/rough';

const ROUGHNESS = 2.5;

class EllipseRough extends RectRough {
    type = EShapeTypes.ELLIPSE_ROUGH;

    readonly props: TRectProps;
    readonly #roughCanvas;
    #lastDrawable;
    #isDragging: boolean = false;
    substrateKonvaShape: Konva.Ellipse;
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
            draggable: true,
            sceneFunc: (context, shape) => {
                const selected = this.isSelected() && !this.#isDragging;
                if (selected || !this.#lastDrawable) {
                    this.#lastDrawable = this.#roughCanvas.generator.ellipse(
                        shape.getWidth() / 2,
                        shape.getHeight() / 2,
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

        this.substrateKonvaShape = new Konva.Ellipse({
            x: this.props.x || 0,
            y: this.props.y || 0,
            width: this.props.width || 0,
            height: this.props.height || 0,
            stroke: 'green',
            fill: 'transparent',
            draggable: true,
        });

        this.attachRoughEvents(this.substrateKonvaShape);
    }
}

export default EllipseRough;
