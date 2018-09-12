import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import waitForFontAwesome from './waitForFontAwesome';

import './Icon.less';

/**
 * Icon component
 * @param props
 * @link https://fontawesome.com/get-started
 */
class Icon extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            fontLoaded: false,
        };
    }

    componentDidMount() {
        waitForFontAwesome
            .then(() => {
                this.setState({
                    fontLoaded: true,
                });
            })
            .catch(() => {
                console.warn('Error while loading font awesome');
            });
    }

    render() {
        const { name, inText, className, title } = this.props;

        if (name === '' || name == null) {
            throw new Error('Icon prop `name` couldn\'t be empty');
        }

        const iconClass = classnames(className, 'fa', {
            [`fa-${name}`]: true,
            'icon_in-text': inText,
        });

        if (this.state.fontLoaded) {
            return (
                <span
                    className={iconClass}
                    title={title}
                />
            );
        }

        return (
            <span>{title}</span>
        );
    }
}

Icon.propTypes = {
    name: PropTypes.string.isRequired,
    className: PropTypes.string,
    title: PropTypes.string,
    inText: PropTypes.bool,
};

Icon.defaultProps = {
    className: '',
    title: null,
    inText: false,
};

export default Icon;
