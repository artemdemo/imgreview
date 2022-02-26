import Konva from 'konva';
import SizeTransformAnchorsGroup, {
  TSizePosition,
} from './SizeTransformAnchorsGroup';
import { drawLayers } from '../../model/shapes/shapesActions';
import { ELayerTypes } from '../../model/shapes/shapesModelTypes';
import store from '../../store';
import { CallbackMap } from '../../services/CallbackMap';
import { OnEvtKey } from '../../custom';

/**
 * Konva.Transform is changing the "scale" properties of the node.
 * Which is not what I want, since scaling will affect stroke width
 * and I want that stroke width will stay constant.
 */
class SizeTransform {
  private readonly _cbMap: CallbackMap = new CallbackMap();
  private readonly _anchors: SizeTransformAnchorsGroup;

  constructor(sizePos: TSizePosition) {
    this._anchors = new SizeTransformAnchorsGroup(sizePos);
    this._anchors.on('dragmove', this.onDragMove);
  }

  private onDragMove = (data: TSizePosition) => {
    const key = '_anchordragmove';
    this._cbMap.call(key, data);
    if (!this._cbMap.has(key)) {
      throw new Error(`"${key}" should be defined`);
    }
  };

  // Ratio is `width / height`
  setOriginRatio(originRatio: number) {
    this._anchors.setOriginRatio(originRatio);
  }

  on(key: OnEvtKey, cb: (...rest: any) => void) {
    this._cbMap.set(key, cb);
  }

  update(sizePos: TSizePosition, redrawLayer = true) {
    this._anchors.updatePosition(sizePos);
    if (redrawLayer) {
      store.dispatch(drawLayers(ELayerTypes.ANCHORS_LAYER));
    }
  }

  addToLayer(anchorsLayer: Konva.Layer) {
    this._anchors.addToLayer(anchorsLayer);
  }

  show() {
    this._anchors.show();
  }

  hide() {
    this._anchors.hide();
  }

  destroy() {
    this._anchors.destroy();
  }
}

export default SizeTransform;
