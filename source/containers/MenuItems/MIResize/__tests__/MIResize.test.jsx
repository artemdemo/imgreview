import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import MIResize from '../MIResize';

jest.mock('react-redux');
jest.mock('../MIResizePopup');
jest.mock('../../../../components/Popup/Popup');
jest.mock('../../../../components/Icon/Icon');
jest.mock('../../../../components/TopMenu/TopMenuItem');

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
        const miResize = new MIResize();
        const getSizeMock = jest.fn(() => ({
            width: 10,
            height: 10,
        }));
        miResize.props = {
            canvas: {
                image: {
                    getSize: getSizeMock,
                },
            },
        };
        const showMock = jest.fn();
        let setStateCb;
        const setStateMock = jest.fn((newState, cb) => {
            setStateCb = cb;
        });
        miResize.setState = setStateMock;
        miResize.popupRef = {
            current: {
                show: showMock,
            },
        };
        miResize.onClick();
        setStateCb();
        expect(showMock).toBeCalledWith();
        expect(setStateMock).toBeCalledWith(
            expect.objectContaining({
                width: 10,
                height: 10,
            }),
            expect.anything(),
        );
    });

    it('should handle onSubmit', () => {
        const width = '10';
        const height = '20';
        const updateImageSizeMock = jest.fn();
        const wrapper = mount(
            <MIResize
                canvas={emptyState.canvas}
                updateImageSize={updateImageSizeMock}
            />
        );
        const instance = wrapper.instance();
        instance.onSubmit({
            width,
            height,
        });
        expect(updateImageSizeMock).toBeCalledWith({
            width: Number(width),
            height: Number(height),
        });
    });

    // ToDo: This test is disabled until I'm returning "updateSize" to work
    // describe('should handle updateSize', () => {
    //     const value = '10';
    //     const e = {
    //         target: {
    //             value,
    //         },
    //     };
    //     const wrapper = mount(
    //         <MIResize
    //             canvas={emptyState.canvas}
    //         />
    //     );
    //     wrapper.setState({
    //         widthInit: 10,
    //         heightInit: 5,
    //     });
    //     const instance = wrapper.instance();
    //     const setStateSpy = jest.spyOn(instance, 'setState');
    //
    //     it('width', () => {
    //         jest.clearAllMocks();
    //         instance.updateSize('width', e);
    //         expect(setStateSpy).toBeCalledWith({
    //             height: 5,
    //             width: '10',
    //         });
    //     });
    //
    //     it('height', () => {
    //         jest.clearAllMocks();
    //         instance.updateSize('height', e);
    //         expect(setStateSpy).toBeCalledWith({
    //             width: 20,
    //             height: '10',
    //         });
    //     });
    //
    //     it('should not call setState', () => {
    //         jest.clearAllMocks();
    //         const _e = {
    //             target: {
    //                 value: 'smth',
    //             },
    //         };
    //         instance.updateSize('height', _e);
    //         expect(setStateSpy).not.toBeCalled();
    //     });
    // });
});
