import Konva from 'konva';
import Shape from '../Shape/Shape';
import TextNode from './TextNode';

class Text extends Shape {
    #shapesLayer: Konva.Layer;
    #textNode: TextNode;
    #transformer: Konva.Transformer;

    /**
     * Add to layer
     * @public
     */
    addToLayer(layer: Konva.Layer) {
        this.#shapesLayer = layer;
        this.#textNode = new TextNode({
            text: 'Some text here',
            x: 50,
            y: 80,
            fontSize: 20,
            width: 200
        });

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

        this.#shapesLayer.add(this.#transformer);
        this.#shapesLayer.draw();
    }
}

export default Text;
