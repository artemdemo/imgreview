import React from 'react';
import classnames from 'classnames';
import styled from 'styled-components';
import waitForFontAwesome from './waitForFontAwesome';

import 'font-awesome/css/font-awesome.min.css';

export type TIconProps = {
    name: string;
    className?: string;
    title?: string;
    inText?: boolean;
};

type State = {
    fontLoaded: boolean;
};

const IconSty = styled.span<{inText?: boolean}>`
    padding-right: ${props => props.inText ? '5px' : '0'};
`;

/**
 * Icon component
 * @param props
 * @link https://fontawesome.com/get-started
 */
class Icon extends React.PureComponent<TIconProps, State> {
    private fontAwesomePromise: Promise<any>;
    private unmounted: boolean = false;

    static readonly defaultProps = {
        className: '',
        title: null,
        inText: false,
    };

    constructor(props) {
        super(props);

        this.state = {
            fontLoaded: false,
        };
    }

    componentDidMount() {
        this.fontAwesomePromise = waitForFontAwesome
            .then(() => {
                if (!this.unmounted) {
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
        this.unmounted = true;
    }

    render() {
        const { name, inText, className, title } = this.props;

        if (name === '' || name == null) {
            throw new Error('Icon prop `name` couldn\'t be empty');
        }

        const iconClass = classnames(className, 'fa', {
            [`fa-${name}`]: true,
        });

        if (this.state.fontLoaded) {
            return (
                <IconSty
                    className={iconClass}
                    title={title}
                    inText={inText}
                />
            );
        }

        return (
            <IconSty
                inText={inText}
            >
                {title}
            </IconSty>
        );
    }
}

export default Icon;
