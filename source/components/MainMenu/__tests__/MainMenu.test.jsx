import React from 'react';
import renderer from 'react-test-renderer';
import MainMenu from '../MainMenu';

describe('MainMenu', () => {
    it('simple render', () => {
        const tree = renderer.create(
            <MainMenu />,
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
