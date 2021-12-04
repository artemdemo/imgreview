import React from 'react';
import renderer from 'react-test-renderer';
import ClearFix from '../ClearFix';

describe('ClearFix', () => {
  it('render empty', () => {
    const tree = renderer.create(<ClearFix />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
