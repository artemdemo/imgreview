import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import AppView from '../AppView';

jest.mock('react-redux');
jest.mock('../../components/MainMenu/MainMenu');
jest.mock('../../containers/DropImage/DropImage');
jest.mock('../../containers/CanvasEl/CanvasEl');
jest.mock('../../containers/MenuItems/MIOpenImage');
jest.mock('../../containers/MenuItems/MISave');
jest.mock('../../containers/MenuItems/MIArrow');
jest.mock('../../containers/MenuItems/MIStroke');
jest.mock('../../containers/MenuItems/MIResize');

describe('AppView', () => {
    let addEventListenerSpy;
    let removeEventListenerSpy;
    beforeAll(() => {
        addEventListenerSpy = jest.spyOn(document, 'addEventListener');
        removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    it('should render', () => {
        const tree = renderer.create(
            <AppView />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should mount and unmount', () => {
        jest.clearAllMocks();
        const wrapper = mount(
            <AppView />
        );

        const instance = wrapper.instance();
        expect(addEventListenerSpy).toBeCalledWith(
            'click',
            instance.clickOnBody
        );
        wrapper.unmount();
        expect(removeEventListenerSpy).toBeCalledWith(
            'click',
            instance.clickOnBody
        );
    });
});
