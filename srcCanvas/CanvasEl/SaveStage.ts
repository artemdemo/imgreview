import Konva, { BoundariesRect, TPos } from 'konva';
import { downloadURI, trimCanvas } from '../services/image';
import { reject } from 'lodash';
import * as clipboard from '../services/clipboard';

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

  private trimLayer(
    sourceLayer: Konva.Layer,
    contentRect: BoundariesRect
  ): Promise<HTMLCanvasElement> {
    const layer = sourceLayer.clone();
    this.#stage.add(layer);
    this.#stage.setAttrs({
      width:
        SaveStage.normPosAxis(contentRect.x) +
        contentRect.width +
        2 * SAVE_BORDER,
      height:
        SaveStage.normPosAxis(contentRect.y) +
        contentRect.height +
        2 * SAVE_BORDER,
      x: -1 * contentRect.x + SAVE_BORDER,
      y: -1 * contentRect.y + SAVE_BORDER,
    });
    return new Promise<HTMLCanvasElement>((resolve, reject) => {
      setTimeout(() => {
        const canvas = layer.getCanvas()._canvas;
        const trimResult = trimCanvas(canvas.getContext('2d'));
        if (trimResult) {
          resolve(canvas);
        } else {
          reject(new Error("Can't trim given context"));
        }
        setTimeout(() => {
          this.#stage.getLayers().forEach((layer) => layer.destroy());
        }, 1000);
      });
    });
  }

  async saveFromLayer(
    sourceLayer: Konva.Layer,
    name: string,
    contentRect: BoundariesRect
  ) {
    const trimmedCanvas = await this.trimLayer(sourceLayer, contentRect);
    const dataURL = trimmedCanvas.toDataURL();
    downloadURI(dataURL, name);
  }

  async copyFromLayer(sourceLayer: Konva.Layer, contentRect: BoundariesRect) {
    // @ts-ignore
    if (window?.navigator?.clipboard?.write) {
      const trimmedCanvas = await this.trimLayer(sourceLayer, contentRect);
      trimmedCanvas.toBlob((blob) => {
        const item = new ClipboardItem({ 'image/png': blob! });
        navigator.clipboard.write([item]);
      });
    } else {
      const trimmedCanvas = await this.trimLayer(sourceLayer, contentRect);
      const dataURL = trimmedCanvas.toDataURL();
      clipboard.copyDataUrlAsImage(dataURL);
    }
  }
}
