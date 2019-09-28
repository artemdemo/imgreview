import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import DropImage from '../DropImage';

jest.mock('react-dropzone');
jest.mock('../../../services/loadImage');
jest.mock('../../../../srcCanvas/api');

const state = {
    canvas: {},
};

describe('DropImage', () => {
    const reactReduxMock = require('react-redux');
    const apiMock = require('../../../../srcCanvas/api');
    const loadImage = require('../../../services/loadImage');

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render with image', () => {
        const tree = renderer.create(
            <DropImage canvas={state.canvas} />,
        ).toJSON();

        expect(reactReduxMock.__getLastMaps().mapStateToProps(state)).toEqual({
            canvas: state.canvas,
        });
        expect(tree).toMatchSnapshot();
    });

    it('should render without image', () => {
        const tree = renderer.create(
            <DropImage
                canvas={{
                    ...state.canvas,
                    imageHeight: 0,
                    imageWidth: 0,
                }}
            />,
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should call onDrop', () => {
        const wrapper = mount(
            <DropImage
                canvas={{
                    ...state.canvas,
                    image: null,
                }}
                addImage={() => {}}
            />,
        );
        const file = {data: 'mock file'};
        wrapper.instance().onDrop([file]);
        expect(loadImage.default).toBeCalledWith(file);
    });

    it('should set an image', () => {
        const addImageMock = jest.fn();
        const wrapper = mount(
            <DropImage
                canvas={{
                    ...state.canvas,
                    image: null,
                }}
                addImage={addImageMock}
            />
        );
        const instance = wrapper.instance();
        const file = {
            name: 'some-name.jpg',
        };
        const imgData = {
            content: 'Some image',
        };
        instance.onImageLoaded(file, imgData);
        expect(addImageMock).toBeCalledWith({
            name: file.name,
        });
        expect(apiMock.setImage).toBeCalledWith(imgData);
    });
});
