import lazify from '../lazify';

export default lazify(() => import(/* webpackChunkName: "<CanvasEl />" */ './CanvasEl'));
