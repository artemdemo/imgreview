import React from 'react';
import { mount } from 'enzyme/build';
import CanvasEl from '../CanvasEl';

jest.mock('konva');

describe('CanvasEl', () => {
    jest.clearAllMocks();
    const konvaMock = require('konva');

    it('should create stage', () => {
        const wrapper = mount(
            <CanvasEl />
        );
        const { canvasRef } = wrapper.instance();
        expect(konvaMock.Stage).toBeCalledWith({
            container: canvasRef.current,
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
