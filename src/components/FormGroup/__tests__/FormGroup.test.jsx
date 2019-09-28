import React from 'react';
import renderer from 'react-test-renderer';
import FormGroup from '../FormGroup';

describe('FormGroup', () => {
    it('should render', () => {
        const tree = renderer.create(
            <FormGroup />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should render with children', () => {
        const tree = renderer.create(
            <FormGroup>
                Some child #1
                <div>
                    Some child #2
                </div>
            </FormGroup>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
