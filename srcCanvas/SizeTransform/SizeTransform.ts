import Konva from 'konva';
import SizeTransformAnchorsGroup, {TSizePosition} from './SizeTransformAnchorsGroup';

/**
 * Konva.Transform is changing the "scale" properties of the node.
 * Which is not what I want, since scaling will affect stroke width
 * and I want that stroke width will stay constant.
 */
class SizeTransform {
    readonly #cbMap: Map<string, (...args: any) => void>;
    readonly #anchors: SizeTransformAnchorsGroup;

    constructor(sizePos: TSizePosition) {
        this.#cbMap = new Map();
        this.#anchors = new SizeTransformAnchorsGroup(sizePos, true);
        this.#anchors.on('dragmove', this.onDragMove);
    }

    private onDragMove = (data: TSizePosition) => {
        const dragMoveAnchorCb = this.#cbMap.get('dragmoveanchor');
        if (dragMoveAnchorCb) {
            dragMoveAnchorCb(data);
        } else {
            throw new Error('"dragmoveanchor" should be defined')
        }
    };

    on(key: string, cb) {
        this.#cbMap.set(key, cb);
    }

    update(sizePos: TSizePosition) {
        this.#anchors.updatePosition(sizePos);
    }

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
