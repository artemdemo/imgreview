import Konva from "konva";
import IShape, { TScaleProps } from "../Shape/IShape";
import TextNode, { TStagePosition } from "./TextNode";
import * as api from "../api";
import shapeTypes from "../Shape/shapeTypes";


type TTextProps = {
    fill: string;
    text?: string;
    x?: number;
    y?: number;
    rotation?: number;
    fontSize?: number;
};

class Text implements IShape {
    readonly type = shapeTypes.TEXT;

    readonly #props: TTextProps;
    readonly #cbMap: Map<string, (e?: any) => void>;
    #shapesLayer: Konva.Layer;
    #textNode: TextNode;
    #transformer: Konva.Transformer;
    #isSelected: boolean = false;

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
            fontSize: this.#props.fontSize || 20,
            width: 200,
            fill: this.#props.fill,
            rotation: this.#props.rotation ?? 0,
        }, stagePosition);

        this.#textNode.on('click', this.onClick);
        this.#textNode.on('dragstart', this.onDragStart);
        this.#textNode.on('mouseover', () => {
            const mouseoverCb = this.#cbMap.get('mouseover');
            mouseoverCb && mouseoverCb();
        });
        this.#textNode.on('mouseout', () => {
            const mouseoutCb = this.#cbMap.get('mouseout');
            mouseoutCb && mouseoutCb();
        });

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
            }
        });

        this.#textNode.on('dblclick', () => {
            this.#transformer.hide();
            this.#shapesLayer.draw();
        });

        this.#textNode.on('click', this.focus);

        this.focus();
        this.#shapesLayer.add(this.#transformer);
        this.#shapesLayer.draw();
    }

    private onClick = (e) => {
        api.shapeClicked(this);
        e.cancelBubble = true;
        this.focus();
        const clickCb = this.#cbMap.get('click');
        clickCb && clickCb(this);
    };

    private onDragStart = () => {
        this.focus();
        const dragstartCb = this.#cbMap.get('dragstart');
        dragstartCb && dragstartCb(this);
    };

    on = (key: string, cb) => {
        this.#cbMap.set(key, cb);
    };

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
        this.#isSelected = false;
        this.#textNode.blur();
        this.#transformer.hide();
        this.#shapesLayer.draw();
    }

    focus = () => {
        this.#isSelected = true;
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
        return this.#isSelected;
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
