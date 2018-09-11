import Konva from 'konva';
import Anchor from './Anchor';

class AnchorsGroup {
    static defineAnchors(stage, maxLength) {
        let startX = stage.attrs.width / 4;
        const startY = stage.attrs.height / 2;

        const controlX = stage.attrs.width / 2;

        let endX = startX * 3;

        if (Math.abs(endX - startX) > maxLength) {
            startX = controlX - (maxLength / 2);
            endX = controlX + (maxLength / 2);
        }

        return {
            start: new Anchor(startX, startY),
            control: new Anchor(controlX, startY),
            end: new Anchor(endX, startY),
        };
    }

    constructor() {
        this._anchorLayer = null;
        this._anchors = null;

        this._cbMap = new Map();
    }

    /**
     * @public
     * @param isVisible {boolean}
     */
    visible = (isVisible) => {
        this._anchors.start.visible(isVisible);
        this._anchors.control.visible(isVisible);
        this._anchors.end.visible(isVisible);
        this.draw();
    };

    /**
     * @public
     */
    draw() {
        this._anchorLayer.draw();
    }

    /**
     * @public
     */
    addToStage(stage, maxLength) {
        this._anchorLayer = new Konva.Layer();
        this._anchors = AnchorsGroup.defineAnchors(stage, maxLength);

        this._anchors.start.on(
            'dragmove',
            () => {
                this._cbMap.has('dragmove') && this._cbMap.get('dragmove')();
            },
        );
        this._anchors.control.on(
            'dragmove',
            () => {
                this._cbMap.has('dragmove') && this._cbMap.get('dragmove')();
            },
        );
        this._anchors.end.on(
            'dragmove',
            () => {
                this._cbMap.has('dragmove') && this._cbMap.get('dragmove')();
            },
        );

        this._anchorLayer.add(this._anchors.start.getAnchor());
        this._anchorLayer.add(this._anchors.control.getAnchor());
        this._anchorLayer.add(this._anchors.end.getAnchor());

        stage.add(this._anchorLayer);
    }

    /**
     * @public
     */
    getPosition() {
        return {
            start: this._anchors.start.getPosition(),
            control: this._anchors.control.getPosition(),
            end: this._anchors.end.getPosition(),
        };
    }

    // See explanation of what `delta` is in Anchor.js
    setDelta(x, y) {
        this._anchors.start.setDelta(x, y);
        this._anchors.control.setDelta(x, y);
        this._anchors.end.setDelta(x, y);
    }

    /**
     * Set `on` callback for the arrow (path and head)
     * @public
     * @param key {string}
     * @param cb {function}
     */
    on = (key, cb) => {
        this._cbMap.set(key, cb);
    };
}

export default AnchorsGroup;
