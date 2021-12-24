import Konva, { BoundariesRect, TPos } from 'konva';
import { downloadURI, trimCanvas } from '../services/image';

const SAVE_BORDER = 30;

export class SaveStage {
  readonly #stage: Konva.Stage;

  private static normPosAxis(value: number): number {
    return value < 0 ? Math.abs(value) : 0;
  }

  constructor(el: HTMLDivElement) {
    this.#stage = new Konva.Stage({
      container: el,
      width: 10,
      height: 10,
    });
  }

  saveFromLayer(
    sourceLayer: Konva.Layer,
    name: string,
    contentRect: BoundariesRect,
  ) {
    const layer = sourceLayer.clone();
    this.#stage.add(layer);
    this.#stage.setAttrs({
      width: SaveStage.normPosAxis(contentRect.x) + contentRect.width + (2 * SAVE_BORDER),
      height: SaveStage.normPosAxis(contentRect.y) + contentRect.height + (2 * SAVE_BORDER),
      x: -1 * contentRect.x + SAVE_BORDER,
      y: -1 * contentRect.y + SAVE_BORDER,
    });
    setTimeout(() => {
      const canvas = layer.getCanvas()._canvas;
      const trimResult = trimCanvas(canvas.getContext('2d'));
      if (trimResult) {
        const dataURL = canvas.toDataURL();
        downloadURI(dataURL, name);
      } else {
        throw new Error("Can't trim given context");
      }
      setTimeout(() => {
        this.#stage.getLayers().forEach((layer) => layer.destroy());
      }, 1000);
    });
  }
}
