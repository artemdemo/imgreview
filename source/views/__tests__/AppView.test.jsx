import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import AppView from '../AppView';

jest.mock('react-redux');
jest.mock('../../components/MainMenu/MainMenu');
jest.mock('../../components/AppVersion/AppVersion');
jest.mock('../../containers/CanvasContainer/CanvasContainer.async');
jest.mock('../../containers/MenuItems/MIOpenImage.async');
jest.mock('../../containers/MenuItems/MISave');
jest.mock('../../containers/MenuItems/MIArrow.async');
jest.mock('../../containers/MenuItems/MIGithub');
jest.mock('../../containers/MenuItems/MIStrokeColor');
jest.mock('../../containers/MenuItems/MIStrokeWidth');
jest.mock('../../containers/MenuItems/MIResize/MIResize');

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

    describe('clickOnBody', () => {
        it('should call if id == "app"', () => {
            const blurShapesMock = jest.fn();
            const wrapper = mount(
                <AppView
                    blurShapes={blurShapesMock}
                />
            );
            const instance = wrapper.instance();
            const getAttributeMock = jest.fn(() => 'app');
            instance.clickOnBody({
                target: {
                    getAttribute: getAttributeMock,
                },
            });
            expect(blurShapesMock).toBeCalled();
            expect(getAttributeMock).toBeCalledWith('id');
        });

        it('should call if target is HTML element', () => {
            const blurShapesMock = jest.fn();
            const wrapper = mount(
                <AppView
                    blurShapes={blurShapesMock}
                />
            );
            const instance = wrapper.instance();
            instance.clickOnBody({
                target: {
                    tagName: 'HTML',
                    getAttribute: () => {},
                },
            });
            expect(blurShapesMock).toBeCalled();
        });

        it('should not call clickOnBody', () => {
            const blurShapesMock = jest.fn();
            const wrapper = mount(
                <AppView
                    blurShapes={blurShapesMock}
                />
            );
            const instance = wrapper.instance();
            instance.clickOnBody({});
            expect(blurShapesMock).not.toBeCalled();
        });
    });
});
