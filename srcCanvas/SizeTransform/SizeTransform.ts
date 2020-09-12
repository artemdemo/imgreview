import Konva from 'konva';
import SizeTransformAnchorsGroup, {TSizePosition} from './SizeTransformAnchorsGroup';
import Rect from '../Rect/Rect';
import Ellipse from '../Ellipse/Ellipse';

type TSupportedShapes = Rect|Ellipse;

/**
 * Konva.Transform is changing the "scale" properties of the node.
 * Which is not what I want, since scaling will affect stroke width
 * and I want that stroke width will stay constant.
 */
class SizeTransform {
    readonly #shape: TSupportedShapes;
    readonly #anchors: SizeTransformAnchorsGroup;

    constructor(shape: TSupportedShapes) {
        this.#shape = shape;
        this.#anchors = new SizeTransformAnchorsGroup(this.getShapeSizePosition(), true);
        this.#anchors.on('dragmove', this.onDragMove);
        this.#shape.on('dragmove', this.onDragMoveShape);
    }

    private onDragMove = (data: TSizePosition) => {
        if (this.#shape instanceof Ellipse) {
            data.x = data.x + (data.width / 2);
            data.y = data.y + (data.height / 2);
        }
        this.#shape.setShapeAttrs(data);
    };

    private onDragMoveShape = () => {
        this.update();
    };

    private getShapeSizePosition = (): TSizePosition => {
        const attrs = this.#shape.getAttrs();
        const { x, y } = attrs;
        const sizePos: TSizePosition = {
            x,
            y,
            width: 0,
            height: 0,
        };
        switch (true) {
            case this.#shape instanceof Ellipse:
                const { radiusX, radiusY } = attrs;
                sizePos.x = x - radiusX;
                sizePos.y = y - radiusY;
                sizePos.width = radiusX * 2;
                sizePos.height = radiusY * 2;
                break;
            default:
                const { width, height } = attrs;
                sizePos.width = width;
                sizePos.height = height;
        }
        return sizePos;
    };

    update() {
        this.#anchors.updatePosition(this.getShapeSizePosition());
    }

    addToLayer(layer: Konva.Layer) {
        this.#anchors.addToLayer(layer);
    }

    show() {
        this.#anchors.show();
    }

    hide() {
        this.#anchors.hide();
    }

    destroy() {
        this.#anchors.destroy();
    }
}

export default SizeTransform;
