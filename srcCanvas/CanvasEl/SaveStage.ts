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

  private getDataUrl(
    sourceLayer: Konva.Layer,
    contentRect: BoundariesRect
  ): Promise<string> {
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
    return new Promise<string>((resolve, reject) => {
      setTimeout(() => {
        const canvas = layer.getCanvas()._canvas;
        const trimResult = trimCanvas(canvas.getContext('2d'));
        if (trimResult) {
          const dataURL = canvas.toDataURL();
          resolve(dataURL);
        } else {
          reject(new Error("Can't trim given context"));
        }
        setTimeout(() => {
          this.#stage.getLayers().forEach((layer) => layer.destroy());
        }, 1000);
      });
    });
  }

  saveFromLayer(
    sourceLayer: Konva.Layer,
    name: string,
    contentRect: BoundariesRect
  ) {
    return this.getDataUrl(sourceLayer, contentRect).then((dataURL) => {
      downloadURI(dataURL, name);
    });
  }

  copyFromLayer(sourceLayer: Konva.Layer, contentRect: BoundariesRect) {
    return this.getDataUrl(sourceLayer, contentRect).then((dataURL) => {
      clipboard.copyDataUrlAsImage(dataURL);
    });
  }
}
