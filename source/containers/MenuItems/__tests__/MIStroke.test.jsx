import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import MIStroke from '../MIStroke';

jest.mock('react-redux');
jest.mock('../../../components/MainMenu/MainMenuItem');
jest.mock('../../ColorSelector/ColorSelector');

describe('MIStroke', () => {
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
            <MIStroke
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
            <MIStroke
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
            <MIStroke
                canvas={state.canvas}
                shapes={state.shapes}
                showColorPicker={showColorPickerMock}
            />
        );
        wrapper.find('[data-mock="MainMenuItem"]').simulate('click');
        expect(showColorPickerMock).toBeCalled();
    });
});
