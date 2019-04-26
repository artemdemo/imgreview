import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import MIStrokeColor from '../MIStrokeColor';

jest.mock('react-redux');
jest.mock('../../../components/TopMenu/TopMenuItem');
jest.mock('../../ColorSelector/ColorSelector.async');

describe('MIStrokeColor', () => {
    jest.clearAllMocks();
    const reactReduxMock = require('react-redux');

    it('should render', () => {
        const state = {
            menu: {
                strokeColor: 'red',
            },
        };
        const tree = renderer.create(
            <MIStrokeColor
                menu={state.menu}
            />
        ).toJSON();

        expect(tree).toMatchSnapshot();
        expect(reactReduxMock.__getLastMaps().mapStateToProps(state)).toEqual({
            menu: state.menu,
        });
    });

    it('should be disabled', () => {
        const tree = renderer.create(
            <MIStrokeColor
                menu={{
                    strokeColor: 'red',
                }}
                disabled
            />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should handle click', () => {
        const showColorPickerMock = jest.fn();
        const wrapper = mount(
            <MIStrokeColor
                menu={{
                    strokeColor: 'red',
                }}
                showColorPicker={showColorPickerMock}
            />
        );
        wrapper.find('[data-mock="TopMenuItem"]').simulate('click');
        expect(showColorPickerMock).toBeCalled();
    });
});
