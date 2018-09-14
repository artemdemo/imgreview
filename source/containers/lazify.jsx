import React from 'react';

/**
 * Helper function for async loading of components
 * @param loader
 */
// @example
// export default lazify(() => import(/* webpackChunkName: "UpdatedVehicles" */ './UpdatedVehicles'))
//
const lazify = loader => class LazyComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            Component: null,
        };
        this.unmounted = false;
    }

    componentDidMount() {
        loader().then((pkg) => {
            // I can't cancel `import()` (webpack is not providing such functionality),
            // but if component is unmounted I can't setState()
            // Therefore I'm checking for it
            if (!this.unmounted) {
                this.setState({
                    Component: pkg.default,
                });
            }
        });
    }

    componentWillUnmount() {
        this.unmounted = true;
    }

    render() {
        const { Component } = this.state;

        if (Component) {
            return (
                <Component {...this.props} />
            );
        }

        // Children of async components are used for displaying loading text or animation
        // If there is no children - default text will be displayed
        if (React.Children.count(this.props.children) > 0) {
            return this.props.children;
        }

        return (
            <span />
        );
    }
};

export default lazify;
