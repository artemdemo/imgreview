import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import MIResize from '../MIResize';

jest.mock('react-redux');
jest.mock('react-hotkeys');
jest.mock('../../../canvas/Arrow/Arrow');
jest.mock('../../../components/Popup/Popup');
jest.mock('../../../components/Icon/Icon');
jest.mock('../../../components/MainMenu/MainMenuItem');

const emptyState = {
    canvas: {
        image: null,
    },
};

describe('MIResize', () => {
    jest.clearAllMocks();
    const reactReduxMock = require('react-redux');

    it('should render', () => {
        const tree = renderer.create(
            <MIResize
                canvas={emptyState.canvas}
            />
        ).toJSON();

        expect(tree).toMatchSnapshot();
        expect(reactReduxMock.__getLastMaps().mapStateToProps(emptyState)).toEqual({
            canvas: emptyState.canvas,
        });
    });

    it('should trigger popup open', () => {
        const wrapper = mount(
            <MIResize
                canvas={emptyState.canvas}
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

    it('should handle onResize', () => {
        const width = '10';
        const height = '20';
        const updateImageSizeMock = jest.fn();
        const wrapper = mount(
            <MIResize
                canvas={emptyState.canvas}
                updateImageSize={updateImageSizeMock}
            />
        );
        wrapper.setState({
            width,
            height,
        });
        const instance = wrapper.instance();
        instance.onResize();
        expect(updateImageSizeMock).toBeCalledWith({
            width: Number(width),
            height: Number(height),
        });
    });

    describe('should handle updateSize', () => {
        const value = '10';
        const e = {
            target: {
                value,
            },
        };
        const wrapper = mount(
            <MIResize
                canvas={emptyState.canvas}
            />
        );
        wrapper.setState({
            widthInit: 10,
            heightInit: 5,
        });
        const instance = wrapper.instance();
        const setStateSpy = jest.spyOn(instance, 'setState');

        it('width', () => {
            jest.clearAllMocks();
            instance.updateSize('width', e);
            expect(setStateSpy).toBeCalledWith({
                height: 5,
                width: '10',
            });
        });

        it('height', () => {
            jest.clearAllMocks();
            instance.updateSize('height', e);
            expect(setStateSpy).toBeCalledWith({
                width: 20,
                height: '10',
            });
        });

        it('should not call setState', () => {
            jest.clearAllMocks();
            const _e = {
                target: {
                    value: 'smth',
                },
            };
            instance.updateSize('height', _e);
            expect(setStateSpy).not.toBeCalled();
        });
    });
});
