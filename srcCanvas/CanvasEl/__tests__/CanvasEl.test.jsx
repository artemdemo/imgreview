import React from 'react';
import { mount } from 'enzyme/build';
import CanvasEl from '../CanvasEl';

jest.mock('konva');
jest.mock('react-redux');

describe('CanvasEl', () => {
    jest.clearAllMocks();
    const state = {
        canvas: {
            cursor: 'auto',
        },
    };
    const konvaMock = require('konva/konva');
    const reactReduxMock = require('react-redux');

    it('should create stage', () => {
        const wrapper = mount(
            <CanvasEl
                canvas={state.canvas}
            />
        );
        const { canvasRef } = wrapper.instance();
        expect(konvaMock.Stage).toBeCalledWith({
            container: canvasRef.current,
        });
        expect(reactReduxMock.__getLastMaps().mapStateToProps(state)).toEqual({
            canvas: state.canvas,
        });
    });

    // it('should blur shapes on stage click', () => {
    //     konvaMock.__clearStageCallbacks();
    //     const setStageMock = jest.fn();
    //     const blurShapesMock = jest.fn();
    //     mount(
    //         <CanvasEl
    //             setStage={setStageMock}
    //             blurShapes={blurShapesMock}
    //             canvas={state.canvas}
    //         />
    //     );
    //     konvaMock.__callStage('click');
    //     expect(blurShapesMock).toBeCalled();
    // });
});
