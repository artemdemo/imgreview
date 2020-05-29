import Konva from "konva";
import TransformAnchorsGroup from "./TransformAnchorsGroup";
import Rect from "../Rect/Rect";

/**
 * Konva.Transform is changing the "scale" properties of the node.
 * Which is not what I want, since scaling will affect stroke width
 * and I want that stroke width will stay constant.
 */
class SizeTransform {
    #shape: Rect;
    #anchors: TransformAnchorsGroup;

    constructor(shape: Rect) {
        this.#shape = shape;
        this.#anchors = new TransformAnchorsGroup(shape.getAttrs());
    }

    addToLayer(layer: Konva.Layer) {
        this.#anchors.addToLayer(layer);
    }

    show() {}

    hide() {}

    destroy() {
        console.warn('SizeTransform - destroy() not implemented');
    }
}

export default SizeTransform;
