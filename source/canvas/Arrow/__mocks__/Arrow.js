export let __lastArrowInstance = null;

class Arrow {
    constructor(...props) {
        this.__props = props;
        this.__onClickCb = null;

        __lastArrowInstance = this;
    }

    addToStage = jest.fn();

    onClick = jest.fn((cb) => {
        this.__onClickCb = cb;
    });
}

export default Arrow;
