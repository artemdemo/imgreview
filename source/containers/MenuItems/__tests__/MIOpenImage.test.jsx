import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import MIOpenImage from '../MIOpenImage';

jest.mock('../../../components/Icon/Icon');
jest.mock('../../../components/MainMenu/MainMenuItem');

describe('MIOpenImage', () => {
    it('should render', () => {
        const tree = renderer.create(
            <MIOpenImage />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should handle click', () => {
        const wrapper = mount(
            <MIOpenImage />
        );
        const instance = wrapper.instance();
        const openDialogMock = jest.fn();
        instance.openImgDialogRef = {
            current: {
                openDialog: openDialogMock,
            },
        };
        wrapper.simulate('click');
        expect(openDialogMock).toBeCalled();
    });
});
