import React from 'react';
import renderer from 'react-test-renderer';
import { updateImageSize } from '../model/canvas/canvasActions';
import { App, onImageUpdateCb } from '../index';

jest.mock('react-redux');
jest.mock('react-dom');
jest.mock('../store');
jest.mock('../../srcCanvas/api');
jest.mock('../services/document');
jest.mock('../views/AppView.async');

const reactDomMock = require('react-dom');
const documentMock = require('../services/document');
const apiMock = require('../../srcCanvas/api');
const storeMock = require('../store');

describe('index', () => {
    it('should render App', () => {
        const tree = renderer.create(
            <App />
        ).toJSON();

        expect(tree).toMatchSnapshot();
        expect(documentMock.getElementById).toBeCalledWith('app');
        expect(reactDomMock.render).toBeCalledWith(
            <App />,
            undefined,
        );
    });

    it('should set cb onImageUpdate', () => {
        expect(apiMock.onImageUpdate).toBeCalledWith(onImageUpdateCb)
    });

    it('onImageUpdate callback should dispatch action', () => {
        const data = {
            content: 'Some data',
        };
        onImageUpdateCb(data);
        expect(storeMock.default.dispatch).toBeCalledWith(updateImageSize(data));
    });
});
