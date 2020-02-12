import React from 'react';
import _omit from 'lodash/omit';

class LazyComponent extends React.PureComponent {
    state = {
        Component: null,
    };

    componentDidMount() {
        const { loader } = this.props;

        loader()
            .then((result) => {
                this.setState({
                    Component: result.default,
                });
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
                <Component {..._omit(this.props, 'loader')} />
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
const lazify = loader => (props) => (
    <LazyComponent loader={loader} {...props} />
);

export default lazify;
