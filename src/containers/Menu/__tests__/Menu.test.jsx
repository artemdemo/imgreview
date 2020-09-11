import React from 'react';
import renderer from 'react-test-renderer';
import Menu from '../Menu';

jest.mock('../../MenuItems/MIOpenImage');
jest.mock('../../MenuItems/MISave');
jest.mock('../../MenuItems/MIArrow');
jest.mock('../../MenuItems/MIText');
jest.mock('../../MenuItems/MISelect');
jest.mock('../../MenuItems/MIRect');
jest.mock('../../MenuItems/MIEllipse');
jest.mock('../../MenuItems/MICrop');
jest.mock('../../MenuItems/MIStrokeColor');
jest.mock('../../MenuItems/MIStrokeWidth');
jest.mock('../../MenuItems/MIResize/MIResize');
jest.mock('../../MenuItems/MIGithub');
jest.mock('../../MenuItems/MIBlankCanvas');
jest.mock('../../../components/TopMenu/TopMenuPanel');
jest.mock('../../../components/TopMenu/Separator');
jest.mock('../../../components/Floating/FloatRight');
jest.mock('../../../../srcCanvas/api');

const apiMock = require('../../../../srcCanvas/api');

describe('Menu', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render', () => {
        const tree = renderer.create(
            <Menu
                canvas={{
                    imageHeight: 10,
                    imageWidth: 10,
                }}
            />
        );

        expect(tree).toMatchSnapshot();
    });
});
