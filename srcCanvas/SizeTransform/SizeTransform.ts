import Konva from "konva";
import SizeTransformAnchorsGroup, {EAnchorNames} from "./SizeTransformAnchorsGroup";
import Rect from "../Rect/Rect";

/**
 * Konva.Transform is changing the "scale" properties of the node.
 * Which is not what I want, since scaling will affect stroke width
 * and I want that stroke width will stay constant.
 */
class SizeTransform {
    readonly #shape: Rect;
    readonly #anchors: SizeTransformAnchorsGroup;

    constructor(shape: Rect) {
        this.#shape = shape;
        this.#anchors = new SizeTransformAnchorsGroup(shape.getAttrs());
        this.#anchors.on('dragmove', this.onMoveAnchor);
    }

    private onMoveAnchor = (anchorName: EAnchorNames, e) => {
        console.log(anchorName, e.target.attrs.x);
    };

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
