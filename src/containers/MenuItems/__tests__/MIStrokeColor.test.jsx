import React from "react";
import renderer from "react-test-renderer";
import MIStrokeColor from "../MIStrokeColor";

jest.mock('react-redux');
jest.mock('../../../components/TopMenu/TopMenuItem');
jest.mock('../../ColorSelector/ColorSelector.async');
jest.mock('../../../services/ganalytics');

describe('MIStrokeColor', () => {
    jest.clearAllMocks();
    const reactReduxMock = require('react-redux');

    it('should not render', () => {
        const tree = renderer.create(
            <MIStrokeColor />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should render', () => {
        const state = {
            menu: {
                strokeColor: 'red',
            },
        };
        const tree = renderer.create(
            <MIStrokeColor
                menu={state.menu}
                show
            />
        ).toJSON();

        expect(tree).toMatchSnapshot();
        expect(reactReduxMock.__getLastMaps().mapStateToProps(state)).toEqual({
            menu: state.menu,
        });
    });

    it('should be disabled', () => {
        const tree = renderer.create(
            <MIStrokeColor
                menu={{
                    strokeColor: 'red',
                }}
                show
                disabled
            />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
