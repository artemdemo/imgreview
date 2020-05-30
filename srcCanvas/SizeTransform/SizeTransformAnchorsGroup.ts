import Konva from "konva";

export enum EAnchorNames {
    left = 'left',
    top = 'top',
    right = 'right',
    bottom = 'bottom',
}

type TAttrs = {
    x: number;
    y: number;
    width: number;
    height: number;
};

class SizeTransformAnchorsGroup {
    readonly #cbMap: Map<string, (...args: any) => void>;
    readonly #anchors: {
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
        this.#cbMap = new Map();
        this.#anchors.left.on('dragmove', this.onMoveAnchor.bind(null, EAnchorNames.left));
        this.#anchors.top.on('dragmove', this.onMoveAnchor.bind(null, EAnchorNames.top));
        this.#anchors.right.on('dragmove', this.onMoveAnchor.bind(null, EAnchorNames.right));
        this.#anchors.bottom.on('dragmove', this.onMoveAnchor.bind(null, EAnchorNames.bottom));
    }

    private onMoveAnchor = (anchorName: EAnchorNames, e) => {
        const dragmoveCb = this.#cbMap.get('dragmove');
        dragmoveCb && dragmoveCb(anchorName, e);
    };

    on(key: string, cb) {
        this.#cbMap.set(key, cb);
    }

    show() {
        this.#anchors.left.visible(true);
        this.#anchors.top.visible(true);
        this.#anchors.right.visible(true);
        this.#anchors.bottom.visible(true);
    }

    hide() {
        this.#anchors.left.visible(false);
        this.#anchors.top.visible(false);
        this.#anchors.right.visible(false);
        this.#anchors.bottom.visible(false);
    }

    addToLayer(layer: Konva.Layer) {
        layer.add(this.#anchors.left);
        layer.add(this.#anchors.top);
        layer.add(this.#anchors.right);
        layer.add(this.#anchors.bottom);
    }

    destroy() {
        this.#anchors.left.destroy();
        this.#anchors.top.destroy();
        this.#anchors.right.destroy();
        this.#anchors.bottom.destroy();
    }
}

export default SizeTransformAnchorsGroup;
