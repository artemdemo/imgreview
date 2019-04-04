import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import MainMenuItem from '../MainMenuItem';

jest.mock('../../Icon/Icon');
jest.mock('../SubMenu');

describe('MainMenuItem', () => {
    it('simple render', () => {
        const tree = renderer.create(
            <MainMenuItem />,
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should be disabled', () => {
        const tree = renderer.create(
            <MainMenuItem disabled />,
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should handle onClick', () => {
        const onClickMock = jest.fn();
        const wrapper = mount(
            <MainMenuItem onClick={onClickMock}>
                Button text
            </MainMenuItem>
        );
        wrapper.find('button').simulate('click');
        expect(onClickMock).toBeCalled();
    });

    it('should handle subMenu', () => {
        const wrapper = mount(
            <MainMenuItem
                subMenu={[
                    {text: 'some text - 1', value: 1},
                    {text: 'some text - 2', value: 2},
                ]}
            >
                Button text
            </MainMenuItem>
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
