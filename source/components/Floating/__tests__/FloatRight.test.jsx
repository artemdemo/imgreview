import React from 'react';
import renderer from 'react-test-renderer';
import FloatRight from '../FloatRight';

describe('FloatRight', () => {
    it('render empty', () => {
        const tree = renderer.create(
            <FloatRight />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
