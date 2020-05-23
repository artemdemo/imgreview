import React from "react";
import renderer from "react-test-renderer";
import { mount } from "enzyme/build";
import CanvasEl from "../CanvasEl";
import {
    deleteActiveShape,
    setCursor,
} from "../../model/shapes/shapesActions";
import {ECursorTypes} from '../../model/shapes/shapesTypes';

jest.mock('konva');
jest.mock('../../store');

describe('CanvasEl', () => {
    const konvaMock = require('konva');
    const canvasStoreMock = require('../../store').default;

    const shapesMock = {
        layer: {},
    };

    beforeAll(() => {
        canvasStoreMock.getState.mockReturnValue({
            shapes: shapesMock,
        });
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('default render', () => {
        const tree = renderer.create(
            <CanvasEl />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should create stage', () => {
        const wrapper = mount(
            <CanvasEl />
        );
        const { canvasRef } = wrapper.instance();
        expect(konvaMock.Stage).toBeCalledWith({
            container: canvasRef.current,
        });
    });

    it('should handle delete shape', () => {
        const tree = renderer.create(
            <CanvasEl />
        );
        tree.root.instance.onDelete();
        expect(canvasStoreMock.dispatch).toBeCalledTimes(2);
        expect(canvasStoreMock.dispatch).toHaveBeenNthCalledWith(1, deleteActiveShape());
        expect(canvasStoreMock.dispatch).toHaveBeenNthCalledWith(2, setCursor(ECursorTypes.AUTO));
    });
});
