import { BoundariesRect } from 'konva';
import { downloadURI, trimCanvas } from '../services/image';

export class SaveCanvas {
  readonly #content: HTMLCanvasElement;
  readonly #context: CanvasRenderingContext2D;

  constructor() {
    this.#content = document.createElement('canvas');
    this.#context = this.#content.getContext('2d')!;
    this.#content.width = 100;
    this.#content.height = 100;
    document.body.append(this.#content);
  }

  saveFromCanvas(
    canvas: HTMLCanvasElement,
    name: string,
    contentRect: BoundariesRect
  ) {
    console.log(contentRect);
    this.#content.width = contentRect.x + contentRect.width;
    this.#content.height = contentRect.y + contentRect.height;
    setTimeout(() => {
      this.#context.drawImage(canvas, 0, 0);
      const trimResult = trimCanvas(this.#context);
      if (trimResult) {
        const dataURL = this.#content.toDataURL();
        downloadURI(dataURL, name);
      } else {
        throw new Error("Can't trim given context");
      }
    });
  }
}
