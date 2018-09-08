import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import MISave from '../MISave';

jest.mock('react-redux');
jest.mock('../../../canvas/Arrow/Arrow');
jest.mock('../../../components/Popup/Popup');
jest.mock('../../../components/Icon/Icon');
jest.mock('../../../components/MainMenu/MainMenuItem');

describe('MISave', () => {
    jest.clearAllMocks();
    const reactReduxMock = require('react-redux');

    it('should render', () => {
        const state = {
            canvas: {
                image: true,
            },
        };
        const tree = renderer.create(
            <MISave
                canvas={state.canvas}
            />
        ).toJSON();

        expect(tree).toMatchSnapshot();
        expect(reactReduxMock.__getLastMaps().mapStateToProps(state)).toEqual({
            canvas: state.canvas,
        });
    });

    it('should be disabled', () => {
        const state = {
            canvas: {
                image: null,
            },
        };
        const tree = renderer.create(
            <MISave
                canvas={state.canvas}
            />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should trigger popup open and blurShapes', () => {
        const state = {
            canvas: {
                image: true,
            },
        };
        const blurShapesMock = jest.fn();
        const wrapper = mount(
            <MISave
                canvas={state.canvas}
                blurShapes={blurShapesMock}
            />
        );
        const instance = wrapper.instance();
        const showMock = jest.fn();
        instance.popupRef = {
            current: {
                show: showMock,
            },
        };
        instance.onClick();
        expect(showMock).toBeCalled();
        expect(blurShapesMock).toBeCalled();
    });

    it('should handle popup open', () => {
        const imageOriginName = 'some name';
        const state = {
            canvas: {
                imageOriginName,
                image: true,
            },
        };
        const wrapper = mount(
            <MISave
                canvas={state.canvas}
            />
        );
        const instance = wrapper.instance();
        const setStateSpy = jest.spyOn(instance, 'setState');
        instance.onPopupOpen();
        expect(setStateSpy).toBeCalledWith(
            expect.objectContaining({
                name: imageOriginName,
            }),
            expect.any(Function),
        );
    });
});
