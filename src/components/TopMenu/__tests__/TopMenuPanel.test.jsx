import React from 'react';
import renderer from 'react-test-renderer';
import TopMenuPanel from '../TopMenuPanel';

describe('TopMenuPanel', () => {
  it('simple render', () => {
    const tree = renderer.create(<TopMenuPanel />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
