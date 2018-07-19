import Konva from 'konva';

const createImage = (stage, image) => {
    return new Konva.Image({
        image,
    });
};

export default createImage;
