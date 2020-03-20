import Konva from 'konva';
import IShape, { TScaleProps } from '../Shape/IShape';
import TextNode, { TStagePosition } from './TextNode';
import * as api from '../api';


type TTextProps = {
    fill: string;
    text?: string;
    x?: number;
    y?: number;
    rotation?: number;
};

class Text implements IShape {
    readonly #props: TTextProps;
    #shapesLayer: Konva.Layer;
    #textNode: TextNode;
    #transformer: Konva.Transformer;
    #cbMap: any;
    #_isSelected: boolean = false;

    constructor(props: TTextProps) {
        this.#props = {...props};
        this.#cbMap = new Map();
    }

    addToLayer(layer: Konva.Layer, stagePosition: TStagePosition) {
        this.#shapesLayer = layer;
        const x = this.#props.x || (layer.parent.attrs.width / 2) - 100;
        const y = this.#props.y || (layer.parent.attrs.height / 2) - 10;
        this.#textNode = new TextNode({
            text: this.#props.text || 'Some text here',
            x,
            y,
            fontSize: 20,
            width: 200,
            fill: this.#props.fill,
            rotation: this.#props.rotation ?? 0,
        }, stagePosition);

        this.#textNode.on('click', this.onClick);
        this.#textNode.on('dragstart', this.onDragStart);
        this.#textNode.on('mouseover', () => this.#cbMap.has('mouseover') && this.#cbMap.get('mouseover')());
        this.#textNode.on('mouseout', () => this.#cbMap.has('mouseout') && this.#cbMap.get('mouseout')());

        this.#textNode.addToLayer(this.#shapesLayer);

        this.#transformer = new Konva.Transformer({
            node: this.#textNode.getNode(),
            enabledAnchors: ['middle-left', 'middle-right'],
            // set minimum width of text
            boundBoxFunc: function(oldBox, newBox) {
                newBox.width = Math.max(30, newBox.width);
                return newBox;
            }
        });

        this.#textNode.on('dblclick', () => {
            this.#transformer.hide();
            this.#shapesLayer.draw();
        });

        this.#textNode.on('click', this.focus);

        this.#_isSelected = true;
        this.#shapesLayer.add(this.#transformer);
        this.#shapesLayer.draw();
    }

    private onClick = (e) => {
        api.shapeClicked(this);
        e.cancelBubble = true;
        this.#_isSelected = true;
        this.#cbMap.has('click') && this.#cbMap.get('click')(this);
    };

    private onDragStart = () => {
        this.focus();
        this.#cbMap.has('dragstart') && this.#cbMap.get('dragstart')(this);
    };

    /**
     * Set `on` callback
     * @param key {string}
     * @param cb {function}
     */
    on = (key: string, cb) => {
        this.#cbMap.set(key, cb);
    };

    setFillColor(hex: string) {
        this.#textNode.setFillColor(hex);
        this.#props.fill = hex;
        this.#shapesLayer.draw();
    }

    getFillColor() {
        return this.#props.fill;
    }

    blur() {
        this.#_isSelected = false;
        this.#textNode.blur();
        this.#transformer.hide();
        this.#shapesLayer.draw();
    }

    focus = () => {
        this.#_isSelected = true;
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

    isSelected() {
        return this.#_isSelected;
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

    destroy() {
        this.#textNode.destroy();
        this.#transformer.destroy();
        this.#shapesLayer.draw();
    }
}

export default Text;