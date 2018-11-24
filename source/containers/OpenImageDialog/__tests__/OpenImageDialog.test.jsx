/* eslint-disable new-cap */
import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import OpenImageDialog from '../OpenImageDialog';

jest.mock('../../../services/loadImage');
jest.mock('react-redux');

describe('OpenImageDialog', () => {
    const loadImageMock = require('../../../services/loadImage');
    const reactReduxMock = require('react-redux');

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render', () => {
        const state = {
            canvas: {
                image: true,
            },
        };
        const tree = renderer.create(
            <OpenImageDialog
                canvas={state.canvas}
            />,
        ).toJSON();

        expect(tree).toMatchSnapshot();
        expect(reactReduxMock.__getLastMaps().mapStateToProps(state)).toEqual({
            canvas: state.canvas,
        });
    });

    it('should handle click', () => {
        const wrapper = mount(
            <OpenImageDialog />
        );
        wrapper.find('input').simulate('click');
    });

    it('should click() on input', () => {
        const wrapper = mount(
            <OpenImageDialog />
        );
        const instance = wrapper.instance();
        const clickSpy = jest.spyOn(instance.inputFile.current, 'click');
        wrapper.setProps({
            open: true,
        });
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
        expect(loadImageMock.default).not.toBeCalled();
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
        expect(loadImageMock.default).toBeCalledWith(file);
    });

    it('should simulate click, when opened', () => {
        const openImageDialog = new OpenImageDialog();
        const clickMock = jest.fn();
        openImageDialog.inputFile = {
            current: {
                click: clickMock,
            },
        };
        openImageDialog.props = {
            open: true,
        };
        const prevProps = {
            open: false,
        };
        openImageDialog.componentDidUpdate(prevProps);
        expect(clickMock).toBeCalled();
    });

    it('should not simulate click, if not opened', () => {
        const openImageDialog = new OpenImageDialog();
        const clickMock = jest.fn();
        openImageDialog.inputFile = {
            current: {
                click: clickMock,
            },
        };
        openImageDialog.props = {
            open: true,
        };
        const prevProps = {
            open: true,
        };
        openImageDialog.componentDidUpdate(prevProps);
        expect(clickMock).not.toBeCalled();
    });
});
