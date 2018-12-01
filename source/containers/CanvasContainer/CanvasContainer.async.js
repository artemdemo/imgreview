import lazify from '../lazify';

export default lazify(() => import(/* webpackChunkName: "<CanvasContainer />" */ './CanvasContainer'));
