import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import MIResize from '../MIResize';

jest.mock('react-redux');
jest.mock('../../../canvas/Arrow/Arrow');
jest.mock('../../../components/Popup/Popup');
jest.mock('../../../components/Icon/Icon');
jest.mock('../../../components/MainMenu/MainMenuItem');

describe('MIResize', () => {
    jest.clearAllMocks();
    const reactReduxMock = require('react-redux');

    it('should render', () => {
        const state = {
            canvas: {
                image: null,
            },
        };
        const tree = renderer.create(
            <MIResize
                canvas={state.canvas}
            />
        ).toJSON();

        expect(tree).toMatchSnapshot();
        expect(reactReduxMock.__getLastMaps().mapStateToProps(state)).toEqual({
            canvas: state.canvas,
        });
    });

    it('should trigger popup open', () => {
        const state = {
            canvas: {
                image: null,
            },
        };
        const wrapper = mount(
            <MIResize
                canvas={state.canvas}
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
    });

    it('should handle popup open', () => {
        const width = 10;
        const height = 20;
        const state = {
            canvas: {
                image: {
                    getSize: () => ({
                        width,
                        height,
                    }),
                },
            },
        };
        const wrapper = mount(
            <MIResize
                canvas={state.canvas}
            />
        );
        const instance = wrapper.instance();
        const setStateMock = jest.fn();
        instance.setState = setStateMock;
        instance.onPopupOpen();
        expect(setStateMock).toBeCalledWith(expect.objectContaining({
            width,
            height,
            widthInit: width,
            heightInit: height,
        }));
    });
});
