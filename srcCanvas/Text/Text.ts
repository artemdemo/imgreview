import Konva from 'konva';
import Shape from '../Shape/Shape';

class Text extends Shape {
    #shapesLayer: Konva.Layer;
    #textNode: Konva.Text;
    #transformer: Konva.Transformer;

    /**
     * Add to layer
     * @public
     */
    addToLayer(layer: Konva.Layer) {
        this.#shapesLayer = layer;
        this.#textNode = new Konva.Text({
            text: 'Some text here',
            x: 50,
            y: 80,
            fontSize: 20,
            draggable: true,
            width: 200
        });

        this.#shapesLayer.add(this.#textNode);

        this.#transformer = new Konva.Transformer({
            node: this.#textNode,
            enabledAnchors: ['middle-left', 'middle-right'],
            // set minimum width of text
            boundBoxFunc: function(oldBox, newBox) {
                newBox.width = Math.max(30, newBox.width);
                return newBox;
            }
        });
        this.#textNode.on('transform', () => {
            // reset scale, so only with is changing by transformer
            this.#textNode.setAttrs({
                width: this.#textNode.width() * this.#textNode.scaleX(),
                scaleX: 1
            });
        });

        this.#shapesLayer.add(this.#transformer);
        this.#shapesLayer.draw();
    }
}

export default Text;
