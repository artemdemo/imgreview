import { handleActions } from 'redux-actions';
import * as stageActions from './stageActions';

export type TStateStage = {
    instance: any;
};

const initState: TStateStage = {
    instance: null,
};

export default handleActions({
    [stageActions.setStage]: (state: TStateStage, action) => ({
        ...state,
        instance: action.payload,
    }),
}, initState);
