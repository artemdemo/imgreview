import React, {ReactElement} from 'react';
import _ from 'lodash';

type TProps = {
  loader: () => Promise<any>;
  isLoaded?: () => void;
};

type TState = {
  Component: ReactElement | null;
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
          // Therefore, I'll trigger it only after my state is fully updated.
          isLoaded && isLoaded();
        }
      );
    });
  }

  render() {
    const { Component } = this.state;
    if (Component) {
      return (
        // @ts-ignore
        <Component {..._.omit(this.props, ['loader', 'isLoaded'])} />
      );
    }
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
