import React from 'react';
import { mount } from 'enzyme';
import MIStrokeWidth from '../MIStrokeWidth';
import renderer from 'react-test-renderer';

jest.mock('react-redux');
jest.mock('../../../components/TopMenu/TopMenuItem');
jest.mock('../../../../srcCanvas/api');
jest.mock('../../../services/ganalytics');

const eventMock = {
    stopPropagation: jest.fn(),
};

const apiMock = require('../../../../srcCanvas/api');

describe('MIStrokeWidth', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should not render', () => {
        const tree = renderer.create(
            <MIStrokeWidth
                menu={{ strokeWidth: 5 }}
            />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should render', () => {
        const tree = renderer.create(
            <MIStrokeWidth
                menu={{ strokeWidth: 5 }}
                show
            />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should render disabled', () => {
        const tree = renderer.create(
            <MIStrokeWidth
                menu={{ strokeWidth: 5 }}
                show
                disabled
            />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should handle menu click', () => {
        const toggleSubmenu = jest.fn();
        const wrapper = mount(
            <MIStrokeWidth
                menu={{ strokeWidth: 5 }}
                toggleSubmenu={toggleSubmenu}
            />
        );

        const instance = wrapper.instance();

        instance.handleMenuClick(eventMock);

        expect(eventMock.stopPropagation).toBeCalledWith();
        expect(toggleSubmenu).toBeCalledWith('');
    });

    it('should handle sub-menu click', () => {
        const setStrokeWidthMock = jest.fn();
        const wrapper = mount(
            <MIStrokeWidth
                menu={{ strokeWidth: 5 }}
                setStrokeWidth={setStrokeWidthMock}
            />
        );

        const item = {
            value: 'some value',
        };

        const instance = wrapper.instance();

        instance.handleSubMenuClick(item, eventMock);

        expect(setStrokeWidthMock).toBeCalledWith(item.value);
        expect(apiMock.setStrokeWidthToActiveShape).toBeCalledWith(item.value);
    });
});
