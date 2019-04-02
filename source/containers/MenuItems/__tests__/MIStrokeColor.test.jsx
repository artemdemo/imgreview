import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import MIStrokeColor from '../MIStrokeColor.tsx';

jest.mock('react-redux');
jest.mock('../../../components/MainMenu/MainMenuItem');
jest.mock('../../ColorSelector/ColorSelector.async');

describe('MIStrokeColor', () => {
    jest.clearAllMocks();
    const reactReduxMock = require('react-redux');

    it('should render', () => {
        const state = {
            canvas: {
                image: true,
            },
            shapes: {},
        };
        const tree = renderer.create(
            <MIStrokeColor
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
            <MIStrokeColor
                canvas={state.canvas}
                shapes={state.shapes}
            />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should handle click', () => {
        const showColorPickerMock = jest.fn();
        const state = {
            canvas: {
                image: true,
            },
            shapes: {},
        };
        const wrapper = mount(
            <MIStrokeColor
                canvas={state.canvas}
                shapes={state.shapes}
                showColorPicker={showColorPickerMock}
            />
        );
        wrapper.find('[data-mock="MainMenuItem"]').simulate('click');
        expect(showColorPickerMock).toBeCalled();
    });
});
