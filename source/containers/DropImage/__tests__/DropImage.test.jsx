import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import DropImage from '../DropImage';

jest.mock('../../../services/loadImage');

const state = {
    canvas: {
        image: {},
        stage: {
            setAttr() {},
        },
    },
};

describe('DropImage', () => {
    jest.clearAllMocks();
    const reactReduxMock = require('react-redux');

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
                    image: null,
                }}
            />,
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should call onDrop', () => {
        const loadImage = require('../../../services/loadImage');
        const wrapper = mount(
            <DropImage
                canvas={{
                    ...state.canvas,
                    image: null,
                }}
            />,
        );
        wrapper.find('div').simulate('click');
        expect(loadImage.default).toBeCalledWith(
            {data: 'mock file'}
        );
    });
});
