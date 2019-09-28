import React from 'react';
import renderer from 'react-test-renderer';
import ClearButton from '../ClearButton';

describe('ClearButton', () => {
    it('render empty', () => {
        const tree = renderer.create(
            <ClearButton />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
