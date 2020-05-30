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

    private onMoveAnchor = (type: EAnchorTypes) => {
        const leftAnchorPos = this.#anchors.left.getCenterPosition();
        const topAnchorPos = this.#anchors.top.getCenterPosition();
        const rightAnchorPos = this.#anchors.right.getCenterPosition();
        const bottomAnchorPos = this.#anchors.bottom.getCenterPosition();

        const width = rightAnchorPos.x - leftAnchorPos.x;
        const height = bottomAnchorPos.y - topAnchorPos.y;
        const topPos = height < 0 ? bottomAnchorPos : topAnchorPos;
        const leftPos = width < 0 ? rightAnchorPos : leftAnchorPos;
        if (type === EAnchorTypes.left || type === EAnchorTypes.right) {
            this.#anchors.top.setCenterPosition({
                x: leftAnchorPos.x + (Math.abs(width) / 2),
                y: topAnchorPos.y,
            });
            this.#anchors.bottom.setCenterPosition({
                x: leftAnchorPos.x + (Math.abs(width) / 2),
                y: bottomAnchorPos.y,
            });
        } else if (type === EAnchorTypes.top || type === EAnchorTypes.bottom) {
            this.#anchors.left.setCenterPosition({
                x: leftAnchorPos.x,
                y: topAnchorPos.y + (Math.abs(height) / 2),
            });
            this.#anchors.right.setCenterPosition({
                x: rightAnchorPos.x,
                y: topAnchorPos.y + (Math.abs(height) / 2),
            });
        }

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
