import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import MIArrow from '../MIArrow.tsx';

jest.mock('react-redux');
jest.mock('../../../canvas/Arrow/Arrow.ts');
jest.mock('../../../components/Icon/Icon');
jest.mock('../../../components/TopMenu/TopMenuItem');
jest.mock('../../../model/connectShape');

describe('MIArrow', () => {
    const connectShapeMock = require('../../../model/connectShape');

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
            <MIArrow />
        );
        wrapper.simulate('click');
        expect(connectShapeMock.connectArrow).toBeCalled();
    });
});
