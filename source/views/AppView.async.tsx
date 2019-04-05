/**
 * Notice: This file has `.tsx` extension.
 * I need it only to support JSX code in mock file.
 * Typescript doesn't allow to write jsx code in `.ts` files, only in `.tsx`
 */
import lazify from '../services/lazify';

export default lazify(() => import(/* webpackChunkName: "<AppView />" */ './AppView'));
