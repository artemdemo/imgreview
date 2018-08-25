/* eslint-disable new-cap */
import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import OpenImageDialog from '../OpenImageDialog';

jest.mock('../../../services/loadImage');

describe('OpenImageDialog', () => {
    const loadImage = require('../../../services/loadImage');

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render', () => {
        const tree = renderer.create(
            <OpenImageDialog />,
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should handle click', () => {
        const wrapper = mount(
            <OpenImageDialog />
        );
        wrapper.find('input').simulate('click');
    });

    it('should handle openDialog', () => {
        const wrapper = mount(
            <OpenImageDialog />
        );
        const instance = wrapper.instance();
        const clickSpy = jest.spyOn(instance.inputFile.current, 'click');
        instance.openDialog();
        expect(clickSpy).toBeCalled();
    });

    it('should not read image', () => {
        const wrapper = mount(
            <OpenImageDialog />
        );
        const instance = wrapper.instance();
        instance.inputFile.current = {
            files: null,
        };
        instance.readImage();
        expect(loadImage.default).not.toBeCalled();
    });

    it('should read image', () => {
        const wrapper = mount(
            <OpenImageDialog />
        );
        const instance = wrapper.instance();
        const file = {
            name: 'some-name.jpg',
        };
        instance.inputFile.current = {
            files: [file],
        };
        instance.readImage();
        expect(loadImage.default).toBeCalledWith(file);
    });
});
