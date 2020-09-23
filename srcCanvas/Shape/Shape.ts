import Konva from 'konva';
import * as api from '../api';
import TextNode from '../Text/TextNode';
import shapeTypes from './shapeTypes';

class Shape {
    type = shapeTypes.SHAPE;
    readonly cbMap: Map<string, (...args: any) => void>;

    #isSelected: boolean = false;
    #isConnected: boolean = false;

    constructor() {
        this.cbMap = new Map();
    }

    blur() {
        this.#isSelected = false;
    }

    focus() {
        this.#isSelected = true;
    }

    isSelected(): boolean {
        return this.#isSelected;
    }

    isConnected(): boolean {
        return this.#isConnected;
    }

    on(key: string, cb) {
        this.cbMap.set(key, cb);
    }

    addToLayer(shapesLayer: Konva.Layer, anchorsLayer: Konva.Layer) {
        this.#isConnected = true;
    }

    draggable(value: boolean) {
        console.warn('draggable() is not implemented');
        console.warn(this);
    }

    attachBasicEvents(node: Konva.Rect | Konva.Path | TextNode) {
        node.on('click', this.onClick);
        node.on('dragstart', this.onDragStart);
        node.on('mouseover', () => {
            const mouseoverCb = this.cbMap.get('mouseover');
            mouseoverCb && mouseoverCb();
        });
        node.on('mouseout', () => {
            const mouseoutCb = this.cbMap.get('mouseout');
            mouseoutCb && mouseoutCb();
        });
    }

    onClick = (e) => {
        api.shapeClicked(this);
        e.cancelBubble = true;
        this.focus();
        const clickCb = this.cbMap.get('click');
        clickCb && clickCb(this);
    }

    onDragStart = () => {
        this.focus();
        const dragstartCb = this.cbMap.get('dragstart');
        dragstartCb && dragstartCb(this);
    }
}

export default Shape;
