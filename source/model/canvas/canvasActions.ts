import { createAction } from 'redux-actions';

export const addImage = createAction('ADD_IMAGE');
export const setCursor = createAction('SET_CURSOR');

// ToDo: I don't like that I'm defining action type as a different exported type in the same file
// I'm doing it, because of `type Props = {}` that I'll need to define later in `MIResize.jsx` and `MIResizePopup.jsx`
// Later action will be injected via props and I want to get access to it's signature.
// Probably there should be an solution to that, but currently I don't know what's that.
export type TUpdateImageSize = (prop: { width: number, height: number }) => void;
export const updateImageSize = createAction('UPDATE_IMAGE');
