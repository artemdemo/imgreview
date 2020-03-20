import React from 'react';
import classnames from 'classnames';
import styled from 'styled-components';
import withIconFont from './withIconFont';

import 'font-awesome/css/font-awesome.min.css';

export type TIconProps = {
    name: string;
    className?: string;
    title?: string;
    inText?: boolean;
};

type TState = {
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
class Icon extends React.PureComponent<TIconProps, TState> {
    static readonly defaultProps = {
        className: '',
        title: null,
        inText: false,
    };

    render() {
        const { name, inText, className, title } = this.props;

        if (name === '' || name == null) {
            throw new Error('Icon prop `name` couldn\'t be empty');
        }

        const iconClass = classnames(className, 'fa', {
            [`fa-${name}`]: true,
        });

        return (
            <IconSty
                className={iconClass}
                title={title}
                inText={inText}
            />
        );
    }
}

export default withIconFont(Icon);
