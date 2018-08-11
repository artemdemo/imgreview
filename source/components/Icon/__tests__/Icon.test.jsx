/* eslint-disable new-cap */
import React from 'react';
import renderer from 'react-test-renderer';
import Icon from '../Icon';

describe('Icon', () => {
    it('should render with name', () => {
        const tree = renderer.create(
            <Icon name='fire' />,
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should render with name and className', () => {
        const tree = renderer.create(
            <Icon name='fire'className='some-class' />,
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('shoudl render with name and inText', () => {
        const tree = renderer.create(
            <Icon name='fire' inText />,
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should throw an error if no name provided', () => {
        expect(() => {
            Icon({ name: '' });
        }).toThrow();

        expect(() => {
            Icon({});
        }).toThrow();
    });
});
