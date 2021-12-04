import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore();

/**
 * MockProvider
 * @doc https://github.com/arnaudbenard/redux-mock-store
 */
const MockProvider = (props) => {
  const { state } = props;
  return <Provider store={mockStore(state)}>{props.children}</Provider>;
};

MockProvider.propTypes = {
  state: PropTypes.shape({}),
};

export default MockProvider;
