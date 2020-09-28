import React from 'react';
import { connect } from 'react-redux';
import TopMenuItem from '../../components/TopMenu/TopMenuItem';
import * as canvasApi from '../../../srcCanvas/api';
import { t } from '../../services/i18n';

type TProps = {
    show: boolean,
    reverse: boolean,
};

class MISketchify extends React.PureComponent<TProps> {
    static readonly defaultProps = {
        show: false,
        reverse: false,
    };

    onClick = () => {
        canvasApi.sketchifyActiveShape();
    };

    render() {
        const { show, reverse } = this.props;
        const text = reverse ? t('menu.unsketchify') : t('menu.sketchify');
        return (
            <TopMenuItem
                onClick={this.onClick}
                show={show}
                title={text}
            >
                {text}
            </TopMenuItem>
        );
    }
}

export default connect(
    () => ({}),
)(MISketchify);
