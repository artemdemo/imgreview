import lazify from '../../services/lazify';

export default lazify(() => import(/* webpackChunkName: "<ColorSelector />" */ './ColorSelector'));
