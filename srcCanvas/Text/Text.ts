import Konva, {TPos} from 'konva';
import _get from 'lodash/get';
import IShape, { TScaleProps } from '../Shape/IShape';
import TextNode, { TStagePosition } from './TextNode';
import shapeTypes from '../Shape/shapeTypes';
import Shape from '../Shape/Shape';
import store from '../store';
import {drawLayers} from '../model/shapes/shapesActions';
import {ELayerTypes} from '../model/shapes/shapesModelTypes';
import {getInnerProductSpace} from '../services/number';

type TTextProps = {
    fill: string;
    text?: string;
    x?: number;
    y?: number;
    width?: number;
    rotation?: number;
    fontSize?: number;
};

class Text extends Shape implements IShape {
    type = shapeTypes.TEXT;

    readonly #props: TTextProps;
    #textNode: TextNode;
    #transformer: Konva.Transformer;
    #stagePositionCb: () => TStagePosition;

    constructor(props: TTextProps) {
        super();
        this.#props = {...props};
    }

    addToLayer(shapesLayer: Konva.Layer, anchorsLayer: Konva.Layer) {
        super.addToLayer(shapesLayer, anchorsLayer);
        const x = this.#props.x || (shapesLayer.parent.attrs.width / 2) - 100;
        const y = this.#props.y || (shapesLayer.parent.attrs.height / 2) - 10;
        this.#textNode = new TextNode({
            text: this.#props.text || 'Some text here',
            x,
            y,
            fontSize: this.#props.fontSize || 20,
            width: this.#props.width || 200,
            fill: this.#props.fill,
            rotation: this.#props.rotation ?? 0,
        });

        this.attachBasicEvents(this.#textNode);

        this.#textNode.addToLayer(shapesLayer);

        this.#transformer = new Konva.Transformer({
            node: this.#textNode.getNode(),
            enabledAnchors: ['middle-left', 'middle-right'],
            borderStroke: '#2196f3',
            anchorStroke: '#2196f3',
            anchorFill: '#ffffff',
            borderStrokeWidth: 1,
            anchorStrokeWidth: 1,
            // set minimum width of text
            boundBoxFunc: function(oldBox, newBox) {
                newBox.width = Math.max(30, newBox.width);
                return newBox;
            },
        });

        this.#textNode.on('dblclick', () => {
            this.#textNode.setStagePosition(this.#stagePositionCb());
            this.#textNode.makeEditable();
            this.#transformer.hide();
            store.dispatch(drawLayers(ELayerTypes.SHAPES_LAYER));
            store.dispatch(drawLayers(ELayerTypes.ANCHORS_LAYER));
        });

        this.#textNode.on('click', this.focus);

        // Listening to transform events.
        // Other examples of these events could be found here:
        // https://konvajs.org/docs/select_and_transform/Transform_Events.html
        this.#textNode.on('transform', () => {
            store.dispatch(drawLayers(ELayerTypes.SHAPES_LAYER));
        });

        this.#transformer.hide();
        anchorsLayer.add(this.#transformer);
    }

    onDblClickGetStagePosition(stagePositionCb: () => TStagePosition) {
        this.#stagePositionCb = stagePositionCb;
    }

    setFillColor(hex: string) {
        this.#textNode.setAttr('fill', hex);
        this.#props.fill = hex;
    }

    getFillColor() {
        return this.#props.fill;
    }

    setFontSize(fontSize: number) {
        this.#textNode.setAttr('fontSize', fontSize);
        this.#props.fontSize = fontSize;
    }

    blur() {
        super.blur();
        this.#textNode.blur();
        this.#transformer.hide();
    }

    focus = () => {
        super.focus();
        this.#transformer.show();
    };

    scale(scaleProps: TScaleProps) {
        const position = this.#textNode.getPosition();
        this.#textNode.setPosition(
            position.x * scaleProps.wFactor,
            position.y * scaleProps.hFactor,
        );
        this.#textNode.setStagePosition(scaleProps.stagePosition);
    }

    setAttrs(attrs) {
        Object.keys(attrs).forEach((key) => {
            this.#textNode.setAttr(key, attrs[key]);
        });
    }

    crop(cropFramePosition: TPos) {
        const position = this.#textNode.getPosition();
        this.#textNode.setPosition(
            position.x - cropFramePosition.x,
            position.y - cropFramePosition.y,
        );
    }

    draggable(value: boolean): boolean {
        return this.#textNode?.draggable(value);
    }

    clone(): Text {
        const text = this.#textNode?.getText();
        const rotation = this.#textNode?.getRotation();
        const width = _get(this.#textNode?.getAttrs(), 'width');
        return new Text({
            ...this.#props,
            ...this.#textNode?.getPosition(),
            ...(text && { text }),
            ...(rotation && { rotation }),
            ...(width && { width }),
        });
    }

    initDraw(startPos: TPos, currentPos: TPos) {
        this.setAttrs({
            x: startPos.x,
            y: startPos.y,
            rotation: getInnerProductSpace(startPos, currentPos) * (180 / Math.PI),
        });
        store.dispatch(drawLayers(ELayerTypes.SHAPES_LAYER));
    }

    destroy() {
        super.destroy();
        this.#textNode?.destroy();
        this.#transformer?.destroy();
    }
}

export default Text;
