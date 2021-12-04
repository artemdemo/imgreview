import Konva from 'konva';

type TUpdateOptions = {
  value: string;
  top: number;
  left: number;
  width: number;
  height: number;
  fontSize: number;
  lineHeight: string;
  fontFamily: string;
  color: string;
  textAlign: string;
  rotation: number;
};

export enum ETextAreaAttr {
  fontSize = 'fontSize',
  color = 'color',
}

class TextArea {
  readonly #textArea: HTMLTextAreaElement;
  readonly #textNode: Konva.Text;

  constructor(textNode: Konva.Text, value: string = '') {
    this.#textNode = textNode;
    this.#textArea = document.createElement('textarea');
    this.#textArea.value = value;
    document.body.appendChild(this.#textArea);
    this.#textArea.addEventListener('keydown', this.onKeyDown);
    this.#textArea.style.display = 'none';
  }

  private setTextareaWidth(newWidth: number) {
    if (!newWidth) {
      // set width for placeholder
      newWidth = this.#textNode.placeholder.length * this.#textNode.fontSize();
    }
    // some extra fixes on different browsers
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    if (isSafari || isFirefox) {
      newWidth = Math.ceil(newWidth);
    }

    // @ts-ignore
    const isEdge = document.documentMode || /Edge/.test(navigator.userAgent);
    if (isEdge) {
      newWidth += 1;
    }
    this.#textArea.style.width = `${newWidth}px`;
  }

  private onKeyDown = () => {
    const scale = this.#textNode.getAbsoluteScale().x;
    this.setTextareaWidth(this.#textNode.width() * scale);
    this.#textArea.style.height = 'auto';
    this.#textArea.style.height = `${
      this.#textArea.scrollHeight + this.#textNode.fontSize()
    }px`;
  };

  update(options: TUpdateOptions) {
    this.#textArea.style.display = 'initial';
    this.#textArea.value = options.value;
    this.#textArea.style.position = 'absolute';
    this.#textArea.style.top = `${options.top}px`;
    this.#textArea.style.left = `${options.left}px`;
    this.#textArea.style.width = `${options.width}px`;
    this.#textArea.style.height = `${options.height}px`;
    this.#textArea.style.fontSize = `${options.fontSize}px`;
    this.#textArea.style.border = '1px dashed #2196f3';
    this.#textArea.style.padding = '0px';
    this.#textArea.style.margin = '0px';
    this.#textArea.style.overflow = 'hidden';
    this.#textArea.style.background = 'none';
    this.#textArea.style.outline = 'none';
    this.#textArea.style.resize = 'none';
    this.#textArea.style.lineHeight = options.lineHeight;
    this.#textArea.style.fontFamily = options.fontFamily;
    this.#textArea.style.transformOrigin = 'left top';
    this.#textArea.style.textAlign = options.textAlign;
    this.#textArea.style.color = options.color;

    let transform = `rotateZ(${options.rotation}deg)`;

    // also we need to slightly move textarea on firefox
    // because it jumps a bit
    const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    if (isFirefox) {
      const px = 2 + Math.round(options.fontSize / 20);
      transform += `translateY(-${px}px)`;
    }

    this.#textArea.style.transform = transform;

    // reset height
    this.#textArea.style.height = 'auto';
    // after browsers resized it we can set actual value
    this.#textArea.style.height = this.#textArea.scrollHeight + 3 + 'px';
  }

  setAttr(key: ETextAreaAttr, value: any) {
    switch (key) {
      case ETextAreaAttr.fontSize:
        this.#textArea.style.fontSize = `${value}px`;
        break;
      case ETextAreaAttr.color:
        this.#textArea.style.color = value;
        break;
    }
  }

  focus() {
    this.#textArea.focus();
  }

  hide() {
    this.#textArea.style.display = 'none';
  }

  getValue(): string {
    return this.#textArea.value;
  }

  destroy() {
    this.#textArea.removeEventListener('keydown', this.onKeyDown);
    this.#textArea.parentNode?.removeChild(this.#textArea);
  }
}

export default TextArea;
