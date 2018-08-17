export let __lastCalledArgs = null;
const loadImage = (...args) => {
    __lastCalledArgs = args;
};

export default loadImage;
