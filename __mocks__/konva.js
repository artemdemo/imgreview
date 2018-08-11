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

export default {
    Stage,
};
