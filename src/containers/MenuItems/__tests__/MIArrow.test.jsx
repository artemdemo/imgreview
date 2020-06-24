import React from "react";
import { mount } from "enzyme";
import renderer from "react-test-renderer";
import MIArrow from "../MIArrow.tsx";
import * as canvasApi from '../../../../srcCanvas/api';

jest.mock('react-redux');
jest.mock('../../../components/TopMenu/TopMenuItem');
jest.mock('../../../../srcCanvas/api');
jest.mock('../../../services/ganalytics');

describe('MIArrow', () => {
    const canvasApi = require('../../../../srcCanvas/api');
    const ganalyticsMock = require('../../../services/ganalytics');

    beforeAll(() => {
        jest.clearAllMocks();
    });

    it('should render', () => {
        const tree = renderer.create(
            <MIArrow />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should be disabled', () => {
        const tree = renderer.create(
            <MIArrow
                disabled
            />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should handle click', () => {
        const strokeColor = 'red';
        const strokeWidth = 5;
        const wrapper = mount(
            <MIArrow
                menu={{
                    strokeColor,
                    strokeWidth,
                }}
            />
        );
        wrapper.simulate('click');
        expect(canvasApi.startAddingShape).toBeCalledWith(
            canvasApi.EShapeTypes.ARROW,
            {
                strokeColor,
                strokeWidth,
            },
        );
        expect(ganalyticsMock.sendEvent).toBeCalledWith({
            eventAction: 'add Arrow',
            eventCategory: 'MenuClick',
        });
    });
});
