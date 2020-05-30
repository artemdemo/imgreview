import Konva from "konva";

export enum EAnchorTypes {
    left = 'left',
    top = 'top',
    right = 'right',
    bottom = 'bottom',
}

type TAttrs = {
    x: number;
    y: number;
    type: EAnchorTypes,
};

class SizeTransformAnchor {
    readonly #cbMap: Map<string, (...args: any) => void>;
    readonly #anchor: Konva.Rect;
    #attrs: TAttrs;

    constructor(attrs: TAttrs) {
        this.#attrs = attrs;
        this.#cbMap = new Map();
        const rectProps = {
            width: 10,
            height: 10,
            stroke: '#2196f3',
            strokeWidth: 1,
            fill: '#ffffff',
            draggable: true,
        };

        this.#anchor = new Konva.Rect({
            ...rectProps,
            x: attrs.x - (rectProps.width / 2),
            y: attrs.y - (rectProps.height / 2),
            dragBoundFunc(pos) {
                if (attrs.type === EAnchorTypes.left || attrs.type === EAnchorTypes.right) {
                    return {
                        x: pos.x,
                        y: this.absolutePosition().y,
                    };
                }
                return {
                    x: this.absolutePosition().x,
                    y: pos.y,
                };
            },
        });

        this.#anchor.on('dragmove', this.onDragMove);
    }

    private onDragMove = (e) => {
        const dragmoveCb = this.#cbMap.get('dragmove');
        dragmoveCb && dragmoveCb(this.#attrs.type, e);
    };

    show() {
        this.#anchor.visible(true);
    }

    hide() {
        this.#anchor.visible(false);
    }

    on(key: string, cb) {
        this.#cbMap.set(key, cb);
    }

    addToLayer(layer: Konva.Layer) {
        layer.add(this.#anchor);
    }

    destroy() {
        this.#anchor.destroy();
    }
}

export default SizeTransformAnchor;
