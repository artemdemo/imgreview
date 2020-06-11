import Konva, {TPos} from "konva";

export enum EAnchorTypes {
    left = 'left',
    top = 'top',
    right = 'right',
    bottom = 'bottom',
    leftTop = 'leftTop',
    leftBottom = 'leftBottom',
    rightTop = 'rightTop',
    rightBottom = 'rightBottom',
}

type TAttrs = {
    x: number;
    y: number;
    type: EAnchorTypes,
};

const RECT_PROPS = {
    width: 10,
    height: 10,
    stroke: '#2196f3',
    strokeWidth: 1,
    fill: '#ffffff',
    draggable: true,
};

class SizeTransformAnchor {
    readonly #cbMap: Map<string, (...args: any) => void>;
    readonly #anchor: Konva.Rect;
    #attrs: TAttrs;

    constructor(attrs: TAttrs) {
        this.#attrs = attrs;
        this.#cbMap = new Map();

        this.#anchor = new Konva.Rect({
            ...RECT_PROPS,
            x: attrs.x - (RECT_PROPS.width / 2),
            y: attrs.y - (RECT_PROPS.height / 2),
            dragBoundFunc(pos) {
                if (attrs.type === EAnchorTypes.left || attrs.type === EAnchorTypes.right) {
                    return {
                        x: pos.x,
                        y: this.absolutePosition().y,
                    };
                } else if (attrs.type === EAnchorTypes.top || attrs.type === EAnchorTypes.bottom) {
                    return {
                        x: this.absolutePosition().x,
                        y: pos.y,
                    };
                }
                return {
                    x: pos.x,
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

    getCenterPosition(): TPos {
        const attrs = this.#anchor.getAttrs();
        return {
            x: attrs.x + (RECT_PROPS.width / 2),
            y: attrs.y + (RECT_PROPS.height / 2),
        };
    }

    setCenterPosition(pos: TPos) {
        this.#anchor.setAttrs({
            x: pos.x - (RECT_PROPS.width / 2),
            y: pos.y - (RECT_PROPS.height / 2),
        });
    }

    addToLayer(layer: Konva.Layer) {
        layer.add(this.#anchor);
    }

    destroy() {
        this.#anchor.destroy();
    }
}

export default SizeTransformAnchor;
