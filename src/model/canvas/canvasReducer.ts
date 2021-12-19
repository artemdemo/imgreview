import { handleActions } from 'redux-actions';
import * as canvasActions from './canvasActions';
import * as canvasApi from '../../../srcCanvas/api';

// ToDo: Looks like since I'm using infinite canvas -
//   all this functionality is not in use anymore.

export type TStateCanvas = {
  width: number;
  height: number;
  imageOriginName: string;
};

const initState: TStateCanvas = {
  width: 0,
  height: 0,
  imageOriginName: '',
};

export default handleActions<TStateCanvas, any>(
  {
    [`${canvasActions.addImage}`]: (state, action) => {
      const { image, name } = action.payload;
      requestAnimationFrame(() => {
        // In order to keep correct event flow I'm postponing setting of the image.
        // Otherwise `canvasApi.imageUpdated` will be called in the middle of this dispatch.
        canvasApi.setImage({
          image,
          name,
        });
      });
      return {
        ...state,
        imageOriginName: name,
      };
    },
    [`${canvasActions.updateCanvasSize}`]: (state, action) => ({
      ...state,
      width: action.payload.width,
      height: action.payload.height,
    }),
  },
  initState
);
