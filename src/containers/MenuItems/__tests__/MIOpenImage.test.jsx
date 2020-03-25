import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import toJson from 'enzyme-to-json';
import MIOpenImage from '../MIOpenImage';

jest.mock('../../../components/TopMenu/TopMenuItem');
jest.mock('../../../containers/OpenImageDialog/OpenImageDialog');

describe('MIOpenImage', () => {
    it('should render', () => {
        const tree = renderer.create(
            <MIOpenImage />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should handle open', () => {
        const wrapper = mount(
            <MIOpenImage />
        );
        wrapper.setState({
            open: true,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
