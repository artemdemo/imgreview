import Konva from 'konva';
import Shape from '../Shape/Shape';
import TextNode, { TStagePosition } from './TextNode';

class Text extends Shape {
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

        this.#textNode.on('click', this.setFocus);

        this.#shapesLayer.add(this.#transformer);
        this.#shapesLayer.draw();
    }

    clearFocus() {
        this.#textNode.blur();
        this.#transformer.hide();
        this.#shapesLayer.draw();
    }

    setFocus = () => {
        this.#transformer.show();
        this.#transformer.forceUpdate();
        this.#shapesLayer.draw();
    }
}

export default Text;
