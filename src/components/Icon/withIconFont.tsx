import React from 'react';
import waitForFontAwesome from './waitForFontAwesome';

type TProps = {
    title?: string;
    name?: string;
    className?: string;
};

type TState = {
    fontLoaded: boolean;
};

const withIconFont = Component => {
    class ComponentWrapper extends React.PureComponent<TProps, TState> {
        #unmounted: boolean = false;

        static readonly defaultProps = {
            title: undefined,
        };

        state = {
            fontLoaded: false,
        };

        componentDidMount() {
            waitForFontAwesome
                .then(() => {
                    if (!this.#unmounted) {
                        this.setState({
                            fontLoaded: true,
                        });
                    }
                })
                .catch(() => {
                    console.warn('Error while loading font awesome');
                });
        }

        componentWillUnmount() {
            this.#unmounted = true;
        }

        render() {
            if (this.state.fontLoaded) {
                return (
                    <Component {...this.props} />
                )
            }

            return this.props.title || '';
        }
    }

    return ComponentWrapper;
};

export default withIconFont;
