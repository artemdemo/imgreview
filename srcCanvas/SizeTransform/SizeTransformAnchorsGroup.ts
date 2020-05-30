import Konva from "konva";
import SizeTransformAnchor, {EAnchorTypes} from "./SizeTransformAnchor";

type TAttrs = {
    x: number;
    y: number;
    width: number;
    height: number;
};

class SizeTransformAnchorsGroup {
    readonly #cbMap: Map<string, (...args: any) => void>;
    readonly #anchors: {
        left: SizeTransformAnchor;
        top: SizeTransformAnchor;
        right: SizeTransformAnchor;
        bottom: SizeTransformAnchor;
    };

    constructor(attrs: TAttrs) {
        this.#anchors = {
            left: new SizeTransformAnchor({
                x: attrs.x,
                y: attrs.y + (attrs.height / 2),
                type: EAnchorTypes.left,
            }),
            top: new SizeTransformAnchor({
                x: attrs.x + (attrs.width / 2),
                y: attrs.y,
                type: EAnchorTypes.top,
            }),
            right: new SizeTransformAnchor({
                x: attrs.x + attrs.width,
                y: attrs.y + (attrs.height / 2),
                type: EAnchorTypes.right,
            }),
            bottom: new SizeTransformAnchor({
                x: attrs.x + (attrs.width / 2),
                y: attrs.y + attrs.height,
                type: EAnchorTypes.bottom,
            }),
        };
        this.#cbMap = new Map();
        this.#anchors.left.on('dragmove', this.onMoveAnchor);
        this.#anchors.top.on('dragmove', this.onMoveAnchor);
        this.#anchors.right.on('dragmove', this.onMoveAnchor);
        this.#anchors.bottom.on('dragmove', this.onMoveAnchor);
    }

    private onMoveAnchor = () => {
        const width = this.#anchors.right.getCenterPosition().x - this.#anchors.left.getCenterPosition().x;
        const height = this.#anchors.bottom.getCenterPosition().y - this.#anchors.top.getCenterPosition().y;
        const topPos = height < 0 ? this.#anchors.bottom.getCenterPosition() : this.#anchors.top.getCenterPosition();
        const leftPos = width < 0 ? this.#anchors.right.getCenterPosition() : this.#anchors.left.getCenterPosition();
        const dragmoveCb = this.#cbMap.get('dragmove');
        dragmoveCb && dragmoveCb({
            x: leftPos.x,
            y: topPos.y,
            width: Math.abs(width),
            height: Math.abs(height),
        });
    };

    on(key: string, cb) {
        this.#cbMap.set(key, cb);
    }

    show() {
        this.#anchors.left.show();
        this.#anchors.top.show();
        this.#anchors.right.show();
        this.#anchors.bottom.show();
    }

    hide() {
        this.#anchors.left.hide();
        this.#anchors.top.hide();
        this.#anchors.right.hide();
        this.#anchors.bottom.hide();
    }

    addToLayer(layer: Konva.Layer) {
        this.#anchors.left.addToLayer(layer);
        this.#anchors.top.addToLayer(layer);
        this.#anchors.right.addToLayer(layer);
        this.#anchors.bottom.addToLayer(layer);
    }

    destroy() {
        this.#anchors.left.destroy();
        this.#anchors.top.destroy();
        this.#anchors.right.destroy();
        this.#anchors.bottom.destroy();
    }
}

export default SizeTransformAnchorsGroup;
