import React from 'react';
import { mount } from 'enzyme';
import { CanvasEl } from '../CanvasEl';

jest.mock('konva');

describe('CanvasEl', () => {
    jest.clearAllMocks();
    const konvaMock = require('konva');

    it('should create stage', () => {
        const setStageMock = jest.fn();
        const wrapper = mount(
            <CanvasEl
                setStage={setStageMock}
            />
        );
        const { canvasRef } = wrapper.instance();
        expect(setStageMock).toBeCalled();
        expect(konvaMock.Stage).toBeCalledWith({
            container: canvasRef.current,
        });
    });

    it('should blur shapes on stage click', () => {
        konvaMock.__clearStageCallbacks();
        const setStageMock = jest.fn();
        const blurShapesMock = jest.fn();
        mount(
            <CanvasEl
                setStage={setStageMock}
                blurShapes={blurShapesMock}
            />
        );
        konvaMock.__callStage('click');
        expect(blurShapesMock).toBeCalled();
    });
});