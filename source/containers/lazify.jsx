import React from 'react';

/**
 * Helper function for async loading of components
 * @param loader
 */
// @example
// export default lazify(() => import(/* webpackChunkName: "SomeComponent" */ './SomeComponent'))
//
const lazify = loader => (props) => {
    const Component = React.lazy(loader);

    const loadingFallback = (() => {
        if (React.Children.count(props.children) > 0) {
            return props.children;
        }
        return (
            <span>Loading...</span>
        );
    })();

    return (
        <React.Suspense fallback={loadingFallback}>
            <Component {...props} />
        </React.Suspense>
    );
};

export default lazify;
