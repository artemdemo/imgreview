import Konva from 'konva';

type TTextNodeOptions = {
    text: string;
    x: number;
    y: number;
    fontSize: number;
    width: number;
};

class TextNode {
    readonly #textNode: Konva.Text;

    constructor(options: TTextNodeOptions) {
        this.#textNode = new Konva.Text({
            ...options,
            draggable: true,
        });

        this.#textNode.on('transform', () => {
            // reset scale, so only with is changing by transformer
            this.#textNode.setAttrs({
                width: this.#textNode.width() * this.#textNode.scaleX(),
                scaleX: 1
            });
        });
    }

    on(key: string, cb: () => void) {
        this.#textNode.on(key, cb);
    }

    addToLayer(layer: Konva.Layer) {
        layer.add(this.#textNode);
    }

    getNode(): Konva.Text {
        return this.#textNode;
    }
}

export default TextNode;
