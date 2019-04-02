import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import Button from '../Button.tsx';

describe('Button', () => {
    it('empty render', () => {
        const tree = renderer.create(
            <Button />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should render with text', () => {
        const tree = renderer.create(
            <Button>Some text</Button>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should render with title', () => {
        const tree = renderer.create(
            <Button title='some title'>Some text</Button>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should render with primary property', () => {
        const tree = renderer.create(
            <Button primary>Some text</Button>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should render with secondary property', () => {
        const tree = renderer.create(
            <Button secondary>Some text</Button>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should render disabled', () => {
        const tree = renderer.create(
            <Button disabled>Some text</Button>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should handle onClick', () => {
        const onClickMock = jest.fn();
        const wrapper = mount(
            <Button onClick={onClickMock}>Some text</Button>,
        );
        wrapper.find('button').simulate('click');
        expect(onClickMock).toBeCalled();
    });
});
