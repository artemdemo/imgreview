import Konva from 'konva';
import TextArea, { ETextAreaAttr } from './TextArea';

type TTextNodeOptions = {
  fill: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  width: number;
  rotation: number;
};

export type TStagePosition = {
  left: number;
  top: number;
};

class TextNode {
  readonly #textNode: Konva.Text;
  readonly #textArea: TextArea;

  // Stage position is used to place textarea when user double-click on the canvas text element.
  #stagePosition: TStagePosition | undefined;

  constructor(options: TTextNodeOptions) {
    this.#textNode = new Konva.Text({
      ...options,
      draggable: true,
    });

    this.#textNode.on('transform', () => {
      // reset scale, so only with is changing by transformer
      this.#textNode.setAttrs({
        width: this.#textNode.width() * this.#textNode.scaleX(),
        scaleX: 1,
      });
    });

    this.#textArea = new TextArea(this.#textNode, options.text);
  }

  makeEditable = () => {
    this.#textNode.hide();

    const textPosition = this.#textNode.position();

    if (!this.#stagePosition) {
      throw new Error('`this.#stagePosition` is not defined');
    }

    const x = this.#stagePosition.left + textPosition.x;
    const y = this.#stagePosition.top + textPosition.y;

    this.#textArea.update({
      value: this.#textNode.text(),
      top: y,
      left: x,
      width: this.#textNode.width() - this.#textNode.padding() * 2,
      height: this.#textNode.height() - this.#textNode.padding() * 2 + 5,
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

  setStagePosition(pos: TStagePosition) {
    this.#stagePosition = pos;
  }

  setAttr(key: string, value: any) {
    this.#textNode.setAttr(key, value);
    switch (key) {
      case 'fontSize':
        this.#textArea.setAttr(ETextAreaAttr.fontSize, value);
        break;
      case 'fill':
        this.#textArea.setAttr(ETextAreaAttr.color, value);
        break;
    }
  }

  draggable(value: boolean): boolean {
    this.#textNode.setAttr('draggable', value);
    return this.#textNode.getAttr('draggable');
  }

  on(key: string, cb: (e?: any) => void) {
    this.#textNode.on(key, cb);
  }

  addToLayer(layer: Konva.Layer) {
    layer.add(this.#textNode);
  }

  setPosition(x: number, y: number) {
    this.#textNode.setAttrs({ x, y });
  }

  getPosition() {
    return {
      x: this.#textNode.attrs.x,
      y: this.#textNode.attrs.y,
    };
  }

  getText() {
    return this.#textNode.attrs.text;
  }

  getRotation() {
    return this.#textNode.rotation();
  }

  getAttrs() {
    return this.#textNode.getAttrs();
  }

  getNode(): Konva.Text {
    return this.#textNode;
  }

  destroy() {
    this.#textNode?.destroy();
    this.#textArea?.destroy();
  }
}

export default TextNode;
