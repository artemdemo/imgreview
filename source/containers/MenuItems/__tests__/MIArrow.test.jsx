import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import MIArrow from '../MIArrow';
import { cursorTypes } from '../../../model/canvas/canvasConst';

jest.mock('react-redux');
jest.mock('../../../canvas/Arrow/Arrow');

describe('MIArrow', () => {
    jest.clearAllMocks();
    const reactReduxMock = require('react-redux');
    const ArrowMock = require('../../../canvas/Arrow/Arrow');

    it('should render', () => {
        const state = {
            canvas: {
                image: true,
            },
            shapes: {},
        };
        const tree = renderer.create(
            <MIArrow
                canvas={state.canvas}
                shapes={state.shapes}
            />
        ).toJSON();

        expect(tree).toMatchSnapshot();
        expect(reactReduxMock.__getLastMaps().mapStateToProps(state)).toEqual({
            canvas: state.canvas,
            shapes: state.shapes,
        });
    });

    it('should be disabled', () => {
        const state = {
            canvas: {
                image: null,
            },
            shapes: {},
        };
        const tree = renderer.create(
            <MIArrow
                canvas={state.canvas}
                shapes={state.shapes}
            />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should handle click', () => {
        const addArrowMock = jest.fn();
        const blurShapesMock = jest.fn();
        const state = {
            canvas: {
                image: true,
                stage: {},
            },
            shapes: {},
        };
        const wrapper = mount(
            <MIArrow
                canvas={state.canvas}
                shapes={state.shapes}
                addArrow={addArrowMock}
                blurShapes={blurShapesMock}
            />
        );
        wrapper.find('button').simulate('click');
        expect(addArrowMock).toBeCalled();
        expect(ArrowMock.__lastArrowInstance.addToStage).toBeCalled();
        expect(ArrowMock.__lastArrowInstance.on).toHaveBeenCalledTimes(3);
        expect(ArrowMock.__lastArrowInstance.onAnchor).toHaveBeenCalledTimes(2);

        const arrowInstance = 'arrowInstance';
        ArrowMock.__lastArrowInstance.__cbMap.get('click')(arrowInstance);
        expect(blurShapesMock).toBeCalledWith(arrowInstance);
    });

    it('should handle mouseover and mouseout', () => {
        const setCursorMock = jest.fn();
        const state = {
            canvas: {
                image: true,
                stage: {},
            },
            shapes: {},
        };
        const wrapper = mount(
            <MIArrow
                canvas={state.canvas}
                shapes={state.shapes}
                addArrow={() => {}}
                blurShapes={() => {}}
                setCursor={setCursorMock}
            />
        );
        wrapper.find('button').simulate('click');
        ArrowMock.__lastArrowInstance.__cbMap.get('mouseover')();
        expect(setCursorMock).toBeCalledWith(cursorTypes.move);
        ArrowMock.__lastArrowInstance.__cbMap.get('mouseout')();
        expect(setCursorMock).toBeCalledWith(cursorTypes.auto);
        ArrowMock.__lastArrowInstance.__cbAnchorMap.get('mouseover')();
        expect(setCursorMock).toBeCalledWith(cursorTypes.pointer);
        ArrowMock.__lastArrowInstance.__cbAnchorMap.get('mouseout')();
        expect(setCursorMock).toBeCalledWith(cursorTypes.auto);
    });
});
