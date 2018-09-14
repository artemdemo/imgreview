import React from 'react';
import renderer from 'react-test-renderer';
import MIGithub from '../MIGithub';

jest.mock('react-redux');
jest.mock('../../../components/MainMenu/MainMenuItem');
jest.mock('../../../components/Icon/Icon');

describe('MIGithub', () => {
    it('should render', () => {
        const tree = renderer.create(
            <MIGithub />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
