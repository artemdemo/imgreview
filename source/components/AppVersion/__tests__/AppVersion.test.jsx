import React from 'react';
import renderer from 'react-test-renderer';
import AppVersion from '../AppVersion';

describe('AppVersion', () => {
    it('should render', () => {
        const tree = renderer.create(
            <AppVersion />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should render with version', () => {
        const querySelectorOrigin = document.querySelector;
        const version = '1.00.00-mock';
        const getAttributeMock = jest.fn(() => {
            return version;
        });
        const querySelectorMock = jest.fn(() => ({
            getAttribute: getAttributeMock,
        }));
        document.querySelector = querySelectorMock;
        const tree = renderer.create(
            <AppVersion />
        ).toJSON();

        expect(tree).toMatchSnapshot();
        expect(querySelectorMock).toBeCalledWith('[name="app-version"]');
        expect(getAttributeMock).toBeCalledWith('content');
        document.querySelector = querySelectorOrigin;
    });
});
