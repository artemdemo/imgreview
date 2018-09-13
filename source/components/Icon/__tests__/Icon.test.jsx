/* eslint-disable new-cap */
import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import Icon from '../Icon';

jest.mock('../waitForFontAwesome.js');

describe('Icon', () => {
    it('should render with name', () => {
        const wrapper = mount(
            <Icon name='fire' />,
        );
        wrapper.setState({
            fontLoaded: true,
        });

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with name and className', () => {
        const wrapper = mount(
            <Icon name='fire' className='some-class' />,
        );
        wrapper.setState({
            fontLoaded: true,
        });

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with name and title', () => {
        const wrapper = mount(
            <Icon name='fire' title='Fire' />,
        );
        wrapper.setState({
            fontLoaded: true,
        });

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with name and inText', () => {
        const wrapper = mount(
            <Icon name='fire' inText />,
        );
        wrapper.setState({
            fontLoaded: true,
        });

        expect(toJson(wrapper)).toMatchSnapshot();
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
