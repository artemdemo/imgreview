import * as canvasApi from '../../srcCanvas/api';

// The idea is that on blurring we want to perform additional actions.
// Therefore I created separate service for that.
export const blurShapes = () => {
    canvasApi.blurShapes();
};
