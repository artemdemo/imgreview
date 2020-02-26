import Konva from 'konva';
import TextArea from './TextArea';

type TTextNodeOptions = {
    text: string;
    x: number;
    y: number;
    fontSize: number;
    width: number;
};

export type TStagePosition = {
    left: number;
    top: number;
};

class TextNode {
    readonly #textNode: Konva.Text;
    readonly #textArea: TextArea;
    readonly #stagePosition: TStagePosition;

    constructor(options: TTextNodeOptions, stagePosition: TStagePosition) {
        this.#stagePosition = stagePosition;
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

        this.#textNode.on('dblclick', this.onDblClick);

        this.#textArea = new TextArea(this.#textNode, options.text);
    }

    private onDblClick = () => {
        this.#textNode.hide();

        const textPosition = this.#textNode.absolutePosition();
        const areaPosition = {
            x: this.#stagePosition.left + textPosition.x,
            y: this.#stagePosition.top + textPosition.y
        };

        this.#textArea.update({
            value: this.#textNode.text(),
            top: areaPosition.y,
            left: areaPosition.x,
            width: this.#textNode.width() - (this.#textNode.padding() * 2),
            height: this.#textNode.height() - (this.#textNode.padding() * 2) + 5,
            fontSize: this.#textNode.fontSize(),
            lineHeight: this.#textNode.lineHeight(),
            fontFamily: this.#textNode.fontFamily(),
            textAlign: this.#textNode.align(),
            color: this.#textNode.fill(),
            rotation: this.#textNode.rotation(),
        });

        this.#textArea.focus();
    };

    // Blur will remove edit functionality:
    // It means that textarea will be hidden
    blur() {
        this.#textNode.text(this.#textArea.getValue());
        this.#textArea.hide();
        this.#textNode.show();
    }

    on(key: string, cb: (e?: any) => void) {
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
