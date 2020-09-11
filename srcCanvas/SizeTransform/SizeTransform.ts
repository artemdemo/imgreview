import Konva from 'konva';
import SizeTransformAnchorsGroup, {TSizePosition} from './SizeTransformAnchorsGroup';
import Rect from '../Rect/Rect';
import Circle from '../Ellipse/Ellipse';

/**
 * Konva.Transform is changing the "scale" properties of the node.
 * Which is not what I want, since scaling will affect stroke width
 * and I want that stroke width will stay constant.
 */
class SizeTransform {
    readonly #shape: Rect|Circle;
    readonly #anchors: SizeTransformAnchorsGroup;

    constructor(shape: Rect|Circle) {
        this.#shape = shape;
        this.#anchors = new SizeTransformAnchorsGroup(shape.getAttrs(), true);
        this.#anchors.on('dragmove', this.onDragMove);
        this.#shape.on('dragmove', this.onDragMoveShape);
    }

    private onDragMove = (data: TSizePosition) => {
        this.#shape.setShapeAttrs(data);
    };

    private onDragMoveShape = () => {
        this.update();
    };

    update() {
        const attrs = this.#shape.getAttrs();
        const { x, y } = attrs;
        switch (true) {
            case this.#shape instanceof Rect:
                const { width, height } = attrs;
                this.#anchors.updatePosition({
                    x,
                    y,
                    width,
                    height,
                });
                break;
            case this.#shape instanceof Circle:
                const { radiusX, radiusY } = attrs;
                this.#anchors.updatePosition({
                    x,
                    y,
                    width: radiusX * 2,
                    height: radiusY * 2,
                });
                break;
        }
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
