export let __lastArrowInstance: any = null;

class Arrow {
    __props: any;
    __cbMap: any;
    __cbAnchorMap: any;

    constructor(...props) {
        this.__props = props;
        this.__cbMap = new Map();
        this.__cbAnchorMap = new Map();

        __lastArrowInstance = this;
    }

    addToStage = jest.fn();

    addToLayer = jest.fn();

    on = jest.fn((key, cb) => {
        this.__cbMap.set(key, cb);
    });

    onAnchor = jest.fn((key, cb) => {
        this.__cbAnchorMap.set(key, cb);
    });

    setFocus = jest.fn();
}

export default Arrow;
