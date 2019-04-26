import React from 'react';
import renderer from 'react-test-renderer';
import FormButtonsRow from '../FormButtonsRow';

describe('FormButtonsRow', () => {
    it('should render empty', () => {
        const tree = renderer.create(
            <FormButtonsRow />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should render with children', () => {
        const tree = renderer.create(
            <FormButtonsRow>
                <div>child #1</div>
                <div>child #2</div>
                <div>child #3</div>
            </FormButtonsRow>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
