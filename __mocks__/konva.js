let stageCallbacks = [];

export const __clearStageCallbacks = () => {
    stageCallbacks = [];
};

export const __callStage = (name) => {
    stageCallbacks.forEach((stageCallback) => {
        if (stageCallback.name === name) {
            stageCallback.cb();
        }
    });
};

export const Stage = jest.fn(function() {
    this.on = (name, cb) => {
        stageCallbacks.push({
            name,
            cb,
        });
    };
});

export const Image = jest.fn(function() {});

export const Layer = jest.fn(function() {
    this.add = () => {};
});

export default {
    Stage,
    Layer,
};
