import Konva, {TPos} from "konva";
import SizeTransformAnchor, {EAnchorTypes} from "./SizeTransformAnchor";

export type TSizePosition = {
    x: number;
    y: number;
    width: number;
    height: number;
};

class SizeTransformAnchorsGroup {
    readonly #cbMap: Map<string, (...args: any) => void>;
    readonly #anchors: {
        left: SizeTransformAnchor;    // left, leftTop
        top: SizeTransformAnchor;     // top, rightTop
        right: SizeTransformAnchor;   // right, rightBottom
        bottom: SizeTransformAnchor;  // bottom, leftBottom
    };

    static calcAnchorPosition(type: EAnchorTypes, sizePos: TSizePosition): TPos {
        switch (type) {
            case EAnchorTypes.left:
                return {
                    x: sizePos.x,
                    y: sizePos.y + (sizePos.height / 2),
                };
            case EAnchorTypes.top:
                return {
                    x: sizePos.x + (sizePos.width / 2),
                    y: sizePos.y,
                };
            case EAnchorTypes.right:
                return {
                    x: sizePos.x + sizePos.width,
                    y: sizePos.y + (sizePos.height / 2),
                };
            case EAnchorTypes.bottom:
                return {
                    x: sizePos.x + (sizePos.width / 2),
                    y: sizePos.y + sizePos.height,
                };
            case EAnchorTypes.leftTop:
                return {
                    x: sizePos.x,
                    y: sizePos.y,
                };
            case EAnchorTypes.rightTop:
                return {
                    x: sizePos.x + sizePos.width,
                    y: sizePos.y,
                };
            case EAnchorTypes.rightBottom:
                return {
                    x: sizePos.x + sizePos.width,
                    y: sizePos.y + sizePos.height,
                };
            case EAnchorTypes.leftBottom:
                return {
                    x: sizePos.x,
                    y: sizePos.y + sizePos.height,
                };
            default:
                throw new Error(`Position can't be calculated for given type: ${type}`);
        }
    }

    constructor(attrs: TSizePosition, inCorner: boolean) {
        this.#anchors = {
            left: new SizeTransformAnchor({
                ...SizeTransformAnchorsGroup.calcAnchorPosition(
                    inCorner ? EAnchorTypes.leftTop : EAnchorTypes.left,
                    attrs,
                ),
                type: inCorner ? EAnchorTypes.leftTop : EAnchorTypes.left,
            }),
            top: new SizeTransformAnchor({
                ...SizeTransformAnchorsGroup.calcAnchorPosition(
                    inCorner ? EAnchorTypes.rightTop : EAnchorTypes.top,
                    attrs,
                ),
                type: inCorner ? EAnchorTypes.rightTop : EAnchorTypes.top,
            }),
            right: new SizeTransformAnchor({
                ...SizeTransformAnchorsGroup.calcAnchorPosition(
                    inCorner ? EAnchorTypes.rightBottom : EAnchorTypes.right,
                    attrs,
                ),
                type: inCorner ? EAnchorTypes.rightBottom : EAnchorTypes.right,
            }),
            bottom: new SizeTransformAnchor({
                ...SizeTransformAnchorsGroup.calcAnchorPosition(
                    inCorner ? EAnchorTypes.leftBottom : EAnchorTypes.bottom,
                    attrs,
                ),
                type: inCorner ? EAnchorTypes.leftBottom : EAnchorTypes.bottom,
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
                x: leftAnchorPos.x + (width / 2),
                y: topAnchorPos.y,
            });
            this.#anchors.bottom.setCenterPosition({
                x: leftAnchorPos.x + (width / 2),
                y: bottomAnchorPos.y,
            });
        } else if (type === EAnchorTypes.top || type === EAnchorTypes.bottom) {
            this.#anchors.left.setCenterPosition({
                x: leftAnchorPos.x,
                y: topAnchorPos.y + (height / 2),
            });
            this.#anchors.right.setCenterPosition({
                x: rightAnchorPos.x,
                y: topAnchorPos.y + (height / 2),
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

    updatePosition(shapePos: TSizePosition) {
        this.#anchors.left.setCenterPosition(
            SizeTransformAnchorsGroup.calcAnchorPosition(EAnchorTypes.left, shapePos)
        );
        this.#anchors.top.setCenterPosition(
            SizeTransformAnchorsGroup.calcAnchorPosition(EAnchorTypes.top, shapePos)
        );
        this.#anchors.right.setCenterPosition(
            SizeTransformAnchorsGroup.calcAnchorPosition(EAnchorTypes.right, shapePos)
        );
        this.#anchors.bottom.setCenterPosition(
            SizeTransformAnchorsGroup.calcAnchorPosition(EAnchorTypes.bottom, shapePos)
        );
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
