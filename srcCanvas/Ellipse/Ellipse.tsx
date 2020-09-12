/// <reference path="../../types/konva.d.ts" />

import Konva, {TPos} from 'konva';
import EShapeTypes from '../Shape/shapeTypes';
import SizeTransform from '../SizeTransform/SizeTransform';
import {TSizePosition} from '../SizeTransform/SizeTransformAnchorsGroup';
import IGeometricShape from '../Shape/IGeometricShape';
import Rect, {TRectProps} from '../Rect/Rect';

class Ellipse extends Rect implements IGeometricShape {
    readonly type = EShapeTypes.ELLIPSE;

    readonly props: TRectProps;
    shapesLayer: Konva.Layer;
    shape: Konva.Ellipse;
    sizeTransform: SizeTransform;

    constructor(props: TRectProps) {
        super(props);
        this.props = {...props};
    }

    getSizePos = (): TSizePosition => {
        const { x, y, radiusX, radiusY } = this.getAttrs();
        return {
            x: x - radiusX,
            y: y - radiusY,
            width: radiusX * 2,
            height: radiusY * 2,
        };
    };

    onDragMoveAnchor = (data: TSizePosition) => {
        data.x = data.x + (data.width / 2);
        data.y = data.y + (data.height / 2);
        this.setShapeAttrs(data);
    };

    defineShape() {
        this.shape = new Konva.Ellipse({
            x: this.props.x || 0,
            y: this.props.y || 0,
            width: this.props.width || 0,
            height: this.props.height || 0,
            dash: this.props.dash,
            stroke: this.props.stroke,
            strokeWidth: this.props.strokeWidth,
            fill: this.props.fill,
            draggable: true,
        });
    }

    clone(): Ellipse {
        const attrs = this.shape?.getAttrs();
        return new Ellipse({
            ...this.props,
            ...(attrs && {
                x: attrs.x,
                y: attrs.y,
                width: attrs.radiusX * 2,
                height: attrs.radiusY * 2,
                stroke: attrs.stroke,
                strokeWidth: attrs.strokeWidth,
            }),
        });
    }

    initDraw(startPos: TPos, currentPos: TPos) {
        this.blur();
        const width = currentPos.x - startPos.x;
        const height = currentPos.y - startPos.y;
        this.setAttrs({
            x: startPos.x + (width / 2),
            y: startPos.y + (height / 2),
            width: Math.abs(width),
            height: Math.abs(height),
        });
    }
}

export default Ellipse;
