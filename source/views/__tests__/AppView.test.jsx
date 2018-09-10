import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import AppView from '../AppView';
import {blurShapes} from '../../model/shapes/shapesActions';

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
    const reactReduxMock = require('react-redux');

    let addEventListenerSpy;
    let removeEventListenerSpy;
    beforeAll(() => {
        addEventListenerSpy = jest.spyOn(document, 'addEventListener');
        removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render', () => {
        const tree = renderer.create(
            <AppView />
        ).toJSON();

        expect(tree).toMatchSnapshot();
        expect(reactReduxMock.__getLastMaps().mapStateToProps({})).toEqual({});
    });

    it('should mount and unmount', () => {
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

    it('should handle clickOnBody', () => {
        const blurShapesMock = jest.fn();
        const wrapper = mount(
            <AppView
                blurShapes={blurShapesMock}
            />
        );
        const instance = wrapper.instance();
        instance.clickOnBody({
            target: null,
        });
        expect(blurShapesMock).toBeCalled();
    });
});
