export let __lastArrowInstance = null;

class Arrow {
    constructor(...props) {
        this.__props = props;
        this.__cbMap = new Map();

        __lastArrowInstance = this;
    }

    addToStage = jest.fn();

    on = jest.fn((key, cb) => {
        this.__cbMap.set(key, cb);
    });
}

export default Arrow;
