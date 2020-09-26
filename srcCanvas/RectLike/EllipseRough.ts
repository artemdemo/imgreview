/// <reference path="../../types/konva.d.ts" />

import Konva from 'konva';
import rough from 'roughjs';
import EShapeTypes from '../Shape/shapeTypes';
import Rect, {TRectProps} from './Rect';
import {getShapesLayerEl} from '../CanvasEl/CanvasEl';
import * as roughService from '../services/rough';

const ROUGHNESS = 2.5;

class EllipseRough extends Rect {
    type = EShapeTypes.ELLIPSE_ROUGH;

    readonly props: TRectProps;
    readonly #roughCanvas;
    #lastDrawable;
    #isDragging: boolean = false;
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
                    const width = shape.getWidth();
                    const height = shape.getHeight();
                    this.#lastDrawable = this.#roughCanvas.generator.ellipse(
                        width / 2,
                        height / 2,
                        width,
                        height,
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

        this.shape.on('dragstart', () => {
            this.#isDragging = true;
        });
        this.shape.on('dragend', () => {
            this.#isDragging = false;
        });
    }

    clone(): EllipseRough {
        const attrs = this.shape?.getAttrs();
        return new EllipseRough({
            ...this.props,
            ...(attrs && {
                x: attrs.x,
                y: attrs.y,
                width: attrs.width,
                height: attrs.height,
                stroke: attrs.stroke,
                strokeWidth: attrs.strokeWidth,
            }),
        });
    }
}

export default EllipseRough;
