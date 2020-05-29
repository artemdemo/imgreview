import Konva from "konva";

type TAttrs = {
    x: number;
    y: number;
    width: number;
    height: number;
};

class TransformAnchorsGroup {
    #anchors: {
        left: Konva.Rect;
        top: Konva.Rect;
        right: Konva.Rect;
        bottom: Konva.Rect;
    };

    constructor(attrs: TAttrs) {
        const rectProps = {
            width: 10,
            height: 10,
            stroke: '#2196f3',
            strokeWidth: 1,
            fill: '#ffffff',
            draggable: true,
        };
        this.#anchors = {
            left: new Konva.Rect({
                ...rectProps,
                x: attrs.x - (rectProps.width / 2),
                y: attrs.y + (attrs.height / 2) - (rectProps.height / 2),
                dragBoundFunc(pos) {
                    return {
                        x: pos.x,
                        y: this.absolutePosition().y,
                    };
                },
            }),
            top: new Konva.Rect({
                ...rectProps,
                x: attrs.x + (attrs.width / 2) - (rectProps.width / 2),
                y: attrs.y - (rectProps.height / 2),
                dragBoundFunc(pos) {
                    return {
                        x: this.absolutePosition().x,
                        y: pos.y,
                    };
                },
            }),
            right: new Konva.Rect({
                ...rectProps,
                x: attrs.x + attrs.width - (rectProps.width / 2),
                y: attrs.y + (attrs.height / 2) - (rectProps.height / 2),
                dragBoundFunc(pos) {
                    return {
                        x: pos.x,
                        y: this.absolutePosition().y,
                    };
                },
            }),
            bottom: new Konva.Rect({
                ...rectProps,
                x: attrs.x + (attrs.width / 2) - (rectProps.width / 2),
                y: attrs.y + attrs.height - (rectProps.height / 2),
                dragBoundFunc(pos) {
                    return {
                        x: this.absolutePosition().x,
                        y: pos.y,
                    };
                },
            }),
        };
    }

    addToLayer(layer: Konva.Layer) {
        layer.add(this.#anchors.left);
        layer.add(this.#anchors.top);
        layer.add(this.#anchors.right);
        layer.add(this.#anchors.bottom);
    }
}

export default TransformAnchorsGroup;
