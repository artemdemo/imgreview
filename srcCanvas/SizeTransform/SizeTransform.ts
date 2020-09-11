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
        this.#shape.setRectAttrs(data);
    };

    private onDragMoveShape = () => {
        this.update();
    };

    update() {
        const { x, y, width, height } = this.#shape.getAttrs();
        console.log(this.#shape.getAttrs());
        this.#anchors.updatePosition({
            x,
            y,
            width,
            height,
        });
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
