type TTextAreaOptions = {
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

class TextArea {
    readonly #textArea: HTMLTextAreaElement;

    constructor() {
        this.#textArea = document.createElement('textarea');
        document.body.appendChild(this.#textArea);
        this.#textArea.style.display = 'none';
    }

    update(options: TTextAreaOptions) {
        this.#textArea.value = options.value;
        this.#textArea.style.position = 'absolute';
        this.#textArea.style.top = `${options.top}px`;
        this.#textArea.style.left = `${options.left}px`;
        this.#textArea.style.width = `${options.width}px`;
        this.#textArea.style.height = `${options.height}px`;
        this.#textArea.style.fontSize = `${options.fontSize}px`;
        this.#textArea.style.border = 'none';
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
        this.#textArea.style.display = 'initial';

        let transform = `rotateZ(${options.rotation}deg)`;

        // also we need to slightly move textarea on firefox
        // because it jumps a bit
        const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        if (isFirefox) {
            const px = 2 + Math.round(options.fontSize / 20);
            transform += `translateY(-${px}px)`
        }

        this.#textArea.style.transform = transform;

        // reset height
        this.#textArea.style.height = 'auto';
        // after browsers resized it we can set actual value
        this.#textArea.style.height = this.#textArea.scrollHeight + 3 + 'px';
    }

    focus() {
        this.#textArea.focus();
    }

    destroy() {
        this.#textArea.parentNode?.removeChild(this.#textArea);
    }
}

export default TextArea;
