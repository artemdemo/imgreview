import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import MIStrokeWidth from '../MIStrokeWidth';

jest.mock('react-redux');
jest.mock('../../../components/TopMenu/TopMenuItem');
jest.mock('../../../components/Icon/Icon');
jest.mock('../../../../srcCanvas/api');

const eventMock = {
    stopPropagation: jest.fn(),
};

const apiMock = require('../../../../srcCanvas/api');

describe('MIStrokeWidth', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render', () => {
        const wrapper = mount(
            <MIStrokeWidth
                menu={{ strokeWidth: 5 }}
            />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render disabled', () => {
        const wrapper = mount(
            <MIStrokeWidth
                menu={{ strokeWidth: 5 }}
                disabled
            />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
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

        expect(eventMock.stopPropagation).toBeCalledWith();
        expect(setStrokeWidthMock).toBeCalledWith(item.value);
        expect(apiMock.setStrokeWidthToActiveShape).toBeCalledWith(item.value);
    });
});
