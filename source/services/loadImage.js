import { addImage } from '../model/canvas/canvasActions';
import store from '../store';

const loadImage = (file) => {
    const FR = new FileReader();
    FR.onload = (e) => {
        const image = new Image();
        image.addEventListener('load', () => {
            const name = file.name.split('.').slice(0, -1).join('.');
            store.dispatch(addImage(image, name));
        });
        image.src = e.target.result;
    };
    FR.readAsDataURL(file);
};

export default loadImage;
