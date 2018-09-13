import CanvasImage from '../canvas/CanvasImage';

const loadImage = file => new Promise((resolve) => {
    const FR = new FileReader();
    FR.onload = (e) => {
        const image = new Image();
        image.addEventListener('load', () => {
            const name = file.name.split('.').slice(0, -1).join('.');
            resolve({
                image,
                name,
            });
        });
        image.src = e.target.result;
    };
    FR.readAsDataURL(file);
});

export const addImageToStage = (canvas, addImage) => ({ image, name }) => {
    if (canvas.image) {
        canvas.image.destroy();
    }
    canvas.stage.setAttr('width', image.width);
    canvas.stage.setAttr('height', image.height);
    const canvasImage = new CanvasImage({
        image,
    });
    canvasImage.addToStage(canvas.stage);
    addImage(canvasImage, name);
};

export default loadImage;
