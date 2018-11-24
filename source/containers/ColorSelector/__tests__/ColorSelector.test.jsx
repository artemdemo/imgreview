import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import ColorSelector from '../ColorSelector';

jest.mock('react-redux');
jest.mock('react-click-outside');
jest.mock('react-color');

describe('ColorSelector', () => {
    jest.clearAllMocks();
    const reactReduxMock = require('react-redux');

    it('should render without color picker', () => {
        const state = {
            shapes: {
                showColorPicker: false,
            },
        };
        const tree = renderer.create(
            <ColorSelector
                shapes={state.shapes}
            />,
        ).toJSON();

        expect(reactReduxMock.__getLastMaps().mapStateToProps(state)).toEqual({
            shapes: state.shapes,
        });
        expect(tree).toMatchSnapshot();
    });

    it('should render with color picker', () => {
        const tree = renderer.create(
            <ColorSelector
                shapes={{
                    showColorPicker: true,
                    stroke: 'lighblue',
                }}
            />,
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should call `setStroke` onChangeColor', () => {
        const setStrokeMock = jest.fn();
        const hex = 'blueBlack';
        const wrapper = mount(
            <ColorSelector
                setStroke={setStrokeMock}
                shapes={{
                    showColorPicker: false,
                }}
            />
        );
        wrapper.instance().onChangeColor({ hex });
        expect(setStrokeMock).toBeCalledWith(hex);
    });

    it('should call `hideColorPicker` on handleClickOutside', () => {
        const hideColorPickerMock = jest.fn();
        const wrapper = mount(
            <ColorSelector
                hideColorPicker={hideColorPickerMock}
                shapes={{
                    showColorPicker: true,
                }}
            />
        );
        wrapper.instance().handleClickOutside();
        expect(hideColorPickerMock).toBeCalled();
    });
});
