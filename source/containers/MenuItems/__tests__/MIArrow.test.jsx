import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import MIArrow from '../MIArrow.tsx';

jest.mock('react-redux');
jest.mock('../../../canvas/Arrow/Arrow.ts');
jest.mock('../../../components/Icon/Icon');
jest.mock('../../../components/MainMenu/MainMenuItem');
jest.mock('../../../model/connectShape');

describe('MIArrow', () => {
    const reactReduxMock = require('react-redux');
    const connectShapeMock = require('../../../model/connectShape');

    beforeAll(() => {
        jest.clearAllMocks();
    });

    it('should render', () => {
        const state = {
            canvas: {
                image: true,
            },
            shapes: {},
        };
        const tree = renderer.create(
            <MIArrow
                canvas={state.canvas}
                shapes={state.shapes}
            />
        ).toJSON();

        expect(tree).toMatchSnapshot();
        expect(reactReduxMock.__getLastMaps().mapStateToProps(state)).toEqual({
            canvas: state.canvas,
            shapes: state.shapes,
        });
    });

    it('should be disabled', () => {
        const state = {
            canvas: {
                image: null,
            },
            shapes: {},
        };
        const tree = renderer.create(
            <MIArrow
                canvas={state.canvas}
                shapes={state.shapes}
            />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should handle click', () => {
        const state = {
            canvas: {
                image: true,
                stage: {},
            },
            shapes: {},
        };
        const wrapper = mount(
            <MIArrow
                canvas={state.canvas}
                shapes={state.shapes}
            />
        );
        wrapper.simulate('click');
        expect(connectShapeMock.connectArrow).toBeCalled();
    });
});
