import React from 'react';
import _omit from 'lodash/omit';

type TProps = {
  loader: () => Promise<any>;
  isLoaded?: () => void;
};

type TState = {
  Component: any;
};

class LazyComponent extends React.PureComponent<TProps, TState> {
  state = {
    Component: null,
  };

  componentDidMount() {
    const { loader, isLoaded } = this.props;

    loader().then((result) => {
      this.setState(
        {
          Component: result.default,
        },
        () => {
          // I don't know what parent will do after I'll inform him that data is loaded.
          // Therefore I'll trigger it only after my state is fully updated.
          isLoaded && isLoaded();
        }
      );
    });
  }

  loadingFallback = () => {
    if (React.Children.count(this.props.children) > 0) {
      return this.props.children;
    }
    return (
      <span
        style={{
          fontSize: '80%',
          opacity: 0.5,
          marginRight: 5,
          display: 'inline-block',
        }}
      >
        Loading...
      </span>
    );
  };

  render() {
    const { Component } = this.state;
    if (Component) {
      return (
        // @ts-ignore
        <Component {..._omit(this.props, ['loader', 'isLoaded'])} />
      );
    }
    return this.loadingFallback();
  }
}

/**
 * Helper function for async loading of components
 * @param loader
 */
// @example
// export default lazify(() => import(/* webpackChunkName: "SomeComponent" */ './SomeComponent'))
//
const lazify = (loader) => (props) =>
  <LazyComponent loader={loader} {...props} />;

export default lazify;
