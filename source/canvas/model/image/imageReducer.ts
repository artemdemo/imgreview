import { handleActions } from 'redux-actions';
import * as imageActions from './imageActions';

export type TStateImage = {
    instance: any;
};

const initState: TStateImage = {
    instance: null,
};

export default handleActions({
    [imageActions.setImage]: (state: TStateImage, action) => ({
        ...state,
        instance: action.payload,
    }),
}, initState);
