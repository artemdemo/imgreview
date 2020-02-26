import Konva from 'konva';
import Shape, {TScaleFactor} from '../Shape/Shape';
import TextNode, { TStagePosition } from './TextNode';

class Text implements Shape {
    isSelected: boolean = false;

    #shapesLayer: Konva.Layer;
    #textNode: TextNode;
    #transformer: Konva.Transformer;

    addToLayer(layer: Konva.Layer, stagePosition: TStagePosition) {
        this.#shapesLayer = layer;
        this.#textNode = new TextNode({
            text: 'Some text here',
            x: 50,
            y: 80,
            fontSize: 20,
            width: 200
        }, stagePosition);

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

        this.#shapesLayer.add(this.#transformer);
        this.#shapesLayer.draw();
    }

    setStrokeColor(hex: string) {
        console.error('setStrokeColor() is not implemented');
    }

    getStrokeColor(): string {
        console.error('getStrokeColor() is not implemented');
        return '';
    }

    blur() {
        this.#textNode.blur();
        this.#transformer.hide();
        this.#shapesLayer.draw();
    }

    focus = () => {
        this.#transformer.show();
        this.#transformer.forceUpdate();
        this.#shapesLayer.draw();
    };

    scale(factor: TScaleFactor) {
        console.error('scale() is not implemented');
    }

    clone(): Shape {
        console.error('clone() is not implemented');
        return new Text();
    }

    destroy() {
        console.error('destroy() is not implemented');
    }
}

export default Text;
