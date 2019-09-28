import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import MIArrow from '../MIArrow.tsx';

jest.mock('react-redux');
jest.mock('../../../components/Icon/Icon');
jest.mock('../../../components/TopMenu/TopMenuItem');
jest.mock('../../../../srcCanvas/api');

describe('MIArrow', () => {
    const canvasApi = require('../../../../srcCanvas/api');

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
        const wrapper = mount(
            <MIArrow
                menu={{
                    strokeColor: 'red',
                    strokeWidth: 5,
                }}
            />
        );
        wrapper.simulate('click');
        expect(canvasApi.createArrow).toBeCalled();
    });
});
