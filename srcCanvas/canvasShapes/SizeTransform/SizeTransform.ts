import Konva from 'konva';
import SizeTransformAnchorsGroup, {
  TSizePosition,
} from './SizeTransformAnchorsGroup';
import { drawLayers } from '../../model/shapes/shapesActions';
import { ELayerTypes } from '../../model/shapes/shapesModelTypes';
import store from '../../store';
import { CallbackMap } from '../../services/CallbackMap';

/**
 * Konva.Transform is changing the "scale" properties of the node.
 * Which is not what I want, since scaling will affect stroke width
 * and I want that stroke width will stay constant.
 */
class SizeTransform {
  private readonly cbMap: CallbackMap = new CallbackMap();
  private readonly anchors: SizeTransformAnchorsGroup;

  constructor(sizePos: TSizePosition) {
    this.anchors = new SizeTransformAnchorsGroup(sizePos);
    this.anchors.on('dragmove', this.onDragMove);
  }

  private onDragMove = (data: TSizePosition) => {
    const key = '_dragmoveanchor';
    this.cbMap.call(key, data);
    if (!this.cbMap.has(key)) {
      throw new Error(`"${key}" should be defined`);
    }
  };

  // Ratio is `width / height`
  setOriginRatio(originRatio: number) {
    this.anchors.setOriginRatio(originRatio);
  }

  on(key: string, cb: (...rest: any) => void) {
    this.cbMap.set(key, cb);
  }

  update(sizePos: TSizePosition, redrawLayer = true) {
    this.anchors.updatePosition(sizePos);
    if (redrawLayer) {
      store.dispatch(drawLayers(ELayerTypes.ANCHORS_LAYER));
    }
  }

  addToLayer(anchorsLayer: Konva.Layer) {
    this.anchors.addToLayer(anchorsLayer);
  }

  show() {
    this.anchors.show();
  }

  hide() {
    this.anchors.hide();
  }

  destroy() {
    this.anchors.destroy();
  }
}

export default SizeTransform;
