/* eslint-disable new-cap */
import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import IconBase from '../IconBase';

jest.mock('../waitForFontAwesome.ts');

describe('IconBase', () => {
    it('should render with name', () => {
        const wrapper = mount(
            <IconBase name='fire' />,
        );
        wrapper.setState({
            fontLoaded: true,
        });

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with name and className', () => {
        const wrapper = mount(
            <IconBase name='fire' className='some-class' />,
        );
        wrapper.setState({
            fontLoaded: true,
        });

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with name and title', () => {
        const wrapper = mount(
            <IconBase name='fire' title='Fire' />,
        );
        wrapper.setState({
            fontLoaded: true,
        });

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with name and inText', () => {
        const wrapper = mount(
            <IconBase name='fire' inText />,
        );
        wrapper.setState({
            fontLoaded: true,
        });

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should throw an error if no name provided', () => {
        expect(() => {
            const icon = new IconBase();
            icon.props = {
                name: '',
            };
            icon.render();
        }).toThrow();

        expect(() => {
            const icon = new IconBase();
            icon.props = {
                name: null,
            };
            icon.render();
        }).toThrow();

        expect(() => {
            const icon = new IconBase();
            icon.props = {
                name: undefined,
            };
            icon.render();
        }).toThrow();
    });
});
