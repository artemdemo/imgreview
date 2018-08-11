import { addImage } from '../model/canvas/canvasActions';
import store from '../store';

const loadImage = (file) => {
    const FR = new FileReader();
    FR.onload = (e) => {
        const image = new Image();
        image.addEventListener('load', () => {
            store.dispatch(addImage(image));
        });
        image.src = e.target.result;
    };
    FR.readAsDataURL(file);
};

export default loadImage;
