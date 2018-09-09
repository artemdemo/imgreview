import React from 'react';
import renderer from 'react-test-renderer';
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
    jest.clearAllMocks();

    it('should render', () => {
        const tree = renderer.create(
            <AppView />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
