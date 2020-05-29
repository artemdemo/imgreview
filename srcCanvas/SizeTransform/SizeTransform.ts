import Konva from "konva";

/**
 * Konva.Transform is changing the "scale" properties of the node.
 * Which is not what I want, since scaling will affect stroke width
 * and I want that stroke width will stay constant.
 */
class SizeTransform {
    #node: Konva.Rect;
    #anchors: {
        left: Konva.Rect;
        top: Konva.Rect;
        right: Konva.Rect;
        bottom: Konva.Rect;
    };

    constructor(node: Konva.Rect) {
        this.#node = node;
        const attrs = node.getAttrs();
        const rectProps = {
            width: 10,
            height: 10,
            stroke: '#2196f3',
            strokeWidth: 1,
            fill: '#ffffff',
        };
        this.#anchors = {
            left: new Konva.Rect({
                ...rectProps,
                x: attrs.x - (rectProps.width / 2),
                y: attrs.y + (attrs.height / 2) - (rectProps.height / 2),
            }),
            top: new Konva.Rect({
                ...rectProps,
                x: attrs.x + (attrs.width / 2) - (rectProps.width / 2),
                y: attrs.y - (rectProps.height / 2),
            }),
            right: new Konva.Rect({
                ...rectProps,
                x: attrs.x + attrs.width - (rectProps.width / 2),
                y: attrs.y + (attrs.height / 2) - (rectProps.height / 2),
            }),
            bottom: new Konva.Rect({
                ...rectProps,
                x: attrs.x + (attrs.width / 2) - (rectProps.width / 2),
                y: attrs.y + attrs.height - (rectProps.height / 2),
            }),
        };
    }

    addToLayer(layer: Konva.Layer) {
        layer.add(this.#anchors.left);
        layer.add(this.#anchors.top);
        layer.add(this.#anchors.right);
        layer.add(this.#anchors.bottom);
    }

    show() {}

    hide() {}

    destroy() {
        console.warn('SizeTransform - destroy() not implemented');
    }
}

export default SizeTransform;
