import Konva from 'konva';
import { handleActions } from 'redux-actions';
import * as stageActions from './stageActions';

export type TStateStage = {
    instance: Konva.Stage | null;
};

const initState: TStateStage = {
    instance: null,
};

export default handleActions({
    // Stage will be set by CanvasEl on initialization
    [stageActions.setStage]: (state: TStateStage, action) => ({
        ...state,
        instance: action.payload,
    }),
    [stageActions.setStageSize]: (state: TStateStage, action) => {
        const { width, height } = action.payload;
        state.instance?.setAttrs({
            width,
            height,
        });
        return state
    },
}, initState);
