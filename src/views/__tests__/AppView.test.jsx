import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import AppView from '../AppView';

jest.mock('../../../srcCanvas/api');
jest.mock('../../components/TopMenu/TopMenuPanel');
jest.mock('../../components/AppVersion/AppVersion');
jest.mock('../../containers/CanvasContainer/CanvasContainer.async');
jest.mock('../../containers/Menu/Menu');

describe('AppView', () => {
  const canvasApiMock = require('../../../srcCanvas/api');
  const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
  const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render', () => {
    const tree = renderer.create(<AppView />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should mount and unmount', () => {
    const wrapper = mount(<AppView />);

    const instance = wrapper.instance();
    expect(addEventListenerSpy).toBeCalledWith('click', instance.clickOnBody);
    wrapper.unmount();
    expect(removeEventListenerSpy).toBeCalledWith(
      'click',
      instance.clickOnBody
    );
  });

  describe('clickOnBody', () => {
    it('should call if id == "app"', () => {
      const wrapper = mount(<AppView />);
      const instance = wrapper.instance();
      const getAttributeMock = jest.fn(() => 'app');
      instance.clickOnBody({
        target: {
          getAttribute: getAttributeMock,
        },
      });
      expect(canvasApiMock.blurShapes).toBeCalled();
      expect(getAttributeMock).toBeCalledWith('id');
    });

    it('should call if target is HTML element', () => {
      const wrapper = mount(<AppView />);
      const instance = wrapper.instance();
      instance.clickOnBody({
        target: {
          tagName: 'HTML',
          getAttribute: () => {},
        },
      });
      expect(canvasApiMock.blurShapes).toBeCalled();
    });

    it('should not call clickOnBody', () => {
      const wrapper = mount(<AppView />);
      const instance = wrapper.instance();
      instance.clickOnBody({});
      expect(canvasApiMock.blurShapes).not.toBeCalled();
    });
  });
});
