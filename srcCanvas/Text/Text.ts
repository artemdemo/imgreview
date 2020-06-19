import Konva, {TPos} from "konva";
import IShape, { TScaleProps } from "../Shape/IShape";
import TextNode, { TStagePosition } from "./TextNode";
import shapeTypes from "../Shape/shapeTypes";
import Shape from "../Shape/Shape";

type TTextProps = {
    fill: string;
    text?: string;
    x?: number;
    y?: number;
    rotation?: number;
    fontSize?: number;
};

class Text extends Shape implements IShape {
    type = shapeTypes.TEXT;

    readonly #props: TTextProps;
    #shapesLayer: Konva.Layer;
    #textNode: TextNode;
    #transformer: Konva.Transformer;
    #stagePositionCb: () => TStagePosition;

    constructor(props: TTextProps) {
        super();
        this.#props = {...props};
    }

    addToLayer(layer: Konva.Layer) {
        super.addToLayer(layer);
        this.#shapesLayer = layer;
        const x = this.#props.x || (layer.parent.attrs.width / 2) - 100;
        const y = this.#props.y || (layer.parent.attrs.height / 2) - 10;
        this.#textNode = new TextNode({
            text: this.#props.text || 'Some text here',
            x,
            y,
            fontSize: this.#props.fontSize || 20,
            width: 200,
            fill: this.#props.fill,
            rotation: this.#props.rotation ?? 0,
        });

        this.attachBasicEvents(this.#textNode);

        this.#textNode.addToLayer(this.#shapesLayer);

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
            this.#shapesLayer.draw();
        });

        this.#textNode.on('click', this.focus);

        this.focus();
        this.#shapesLayer.add(this.#transformer);
        this.#shapesLayer.draw();
    }

    onDblClickGetStagePosition(stagePositionCb: () => TStagePosition) {
        this.#stagePositionCb = stagePositionCb;
    }

    setFillColor(hex: string) {
        this.#textNode.setAttr('fill', hex);
        this.#props.fill = hex;
        this.#shapesLayer.draw();
    }

    getFillColor() {
        return this.#props.fill;
    }

    setFontSize(fontSize: number) {
        this.#textNode.setAttr('fontSize', fontSize);
        this.#props.fontSize = fontSize;
        this.#shapesLayer.draw();
    }

    blur() {
        super.blur();
        this.#textNode.blur();
        this.#transformer.hide();
        this.#shapesLayer.draw();
    }

    focus = () => {
        super.focus();
        this.#transformer.show();
        this.#transformer.forceUpdate();
        this.#shapesLayer.draw();
    };

    scale(scaleProps: TScaleProps) {
        const position = this.#textNode.getPosition();
        this.#textNode.setPosition(
            position.x * scaleProps.wFactor,
            position.y * scaleProps.hFactor,
        );
        this.#textNode.setStagePosition(scaleProps.stagePosition);
        this.#shapesLayer.draw();
    }

    crop(cropFramePosition: TPos) {
        const position = this.#textNode.getPosition();
        this.#textNode.setPosition(
            position.x - cropFramePosition.x,
            position.y - cropFramePosition.y,
        );
        this.#shapesLayer.draw();
    }

    clone(): Text {
        const text = this.#textNode?.getText();
        const rotation = this.#textNode?.getRotation();
        return new Text({
            ...this.#props,
            ...this.#textNode?.getPosition(),
            ...(text && { text }),
            ...(rotation && { rotation }),
        });
    }

    initDraw(startPos: TPos, currentPos: TPos) {
        console.warn('initDraw() is not implemented yet');
    }

    destroy() {
        this.#textNode.destroy();
        this.#transformer.destroy();
        this.#shapesLayer.draw();
    }
}

export default Text;
