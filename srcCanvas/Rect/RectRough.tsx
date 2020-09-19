/// <reference path="../../types/konva.d.ts" />

import Konva, {TPos} from 'konva';
import rough from 'roughjs';
import EShapeTypes from '../Shape/shapeTypes';
import SizeTransform from '../SizeTransform/SizeTransform';
import {TSizePosition} from '../SizeTransform/SizeTransformAnchorsGroup';
import Rect, {TRectProps} from '../Rect/Rect';
import {getShapesLayerEl} from '../CanvasEl/CanvasEl';

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
            strokeWidth: this.props.strokeWidth,
            fill: this.props.fill,
            draggable: true,
            sceneFunc: (context, shape) => {
                console.log(shape);
                // this.#roughCanvas.rectangle(
                //     this.props.x,
                //     this.props.y,
                //     this.props.width,
                //     this.props.height,
                //     {
                //         roughness: 2.5,
                //         stroke: this.props.stroke,
                //         strokeWidth: this.props.strokeWidth / 2,
                //     },
                // );
                context.fillStrokeShape(shape);
            }
        });
    }

    // clone(): RectRough {
    //
    // }
}

export default RectRough;
