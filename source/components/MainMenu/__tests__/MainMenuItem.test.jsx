import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import MainMenuItem from '../MainMenuItem';

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
});
