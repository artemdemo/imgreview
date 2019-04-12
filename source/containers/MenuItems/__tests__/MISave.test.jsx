import React from 'react';
import renderer from 'react-test-renderer';
import MISave from '../MISave';

jest.mock('react-redux');
jest.mock('../../../components/Popup/Popup');
jest.mock('../../../components/Icon/Icon');
jest.mock('../../../components/TopMenu/TopMenuItem');

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

    it('should trigger popup open', () => {
        const imageOriginName = 'some name';
        const miSave = new MISave();
        miSave.props = {
            canvas: {
                imageOriginName,
                image: true,
            },
        };
        let setStateCb;
        const setStateMock = jest.fn((newState, cb) => {
            setStateCb = cb;
        });
        miSave.setState = setStateMock;

        const showMock = jest.fn();
        miSave.popupRef = {
            current: {
                show: showMock,
            },
        };
        miSave.onClick();
        setStateCb();
        expect(showMock).toBeCalledWith();
        expect(setStateMock).toBeCalledWith(
            expect.objectContaining({
                name: imageOriginName,
            }),
            expect.anything(),
        );
    });
});
