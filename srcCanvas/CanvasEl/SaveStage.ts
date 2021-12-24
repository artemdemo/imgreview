import Konva, { BoundariesRect, TPos } from 'konva';
import { downloadURI, trimCanvas } from '../services/image';

export class SaveStage {
  readonly #stage: Konva.Stage;

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
    contentRect: BoundariesRect
  ) {
    const layer = sourceLayer.clone();
    this.#stage.add(layer);
    const width = contentRect.x + contentRect.width;
    const height = contentRect.y + contentRect.height;
    this.#stage.setAttrs({
      width: width * 1.1,
      height: height * 1.1,
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
      this.#stage.getLayers().forEach((layer) => layer.destroy());
    });
  }
}
