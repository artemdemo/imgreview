import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import TopMenuItem from '../TopMenuItem';

jest.mock('../../Icon/Icon');
jest.mock('../SubMenu');

describe('TopMenuItem', () => {
    it('simple render', () => {
        const tree = renderer.create(
            <TopMenuItem />,
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should be disabled', () => {
        const tree = renderer.create(
            <TopMenuItem disabled />,
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should handle onClick', () => {
        const onClickMock = jest.fn();
        const wrapper = mount(
            <TopMenuItem onClick={onClickMock}>
                Button text
            </TopMenuItem>
        );
        wrapper.find('button').simulate('click');
        expect(onClickMock).toBeCalled();
    });

    it('should handle subMenu', () => {
        const wrapper = mount(
            <TopMenuItem
                subMenu={[
                    {text: 'some text - 1', value: 1},
                    {text: 'some text - 2', value: 2},
                ]}
            >
                Button text
            </TopMenuItem>
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});