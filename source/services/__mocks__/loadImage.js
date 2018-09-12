const loadImage = jest.fn(() => Promise.resolve({
    image: {width: 0, height: 0},
    name: 'some-name',
}));

export default loadImage;
