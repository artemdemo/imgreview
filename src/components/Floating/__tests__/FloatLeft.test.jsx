import React from 'react';
import renderer from 'react-test-renderer';
import FloatLeft from '../FloatLeft';

describe('FloatLeft', () => {
  it('render empty', () => {
    const tree = renderer.create(<FloatLeft />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
