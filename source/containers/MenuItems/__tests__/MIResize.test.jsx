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
});
