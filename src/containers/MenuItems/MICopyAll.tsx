import React from 'react';
import { connect } from 'react-redux';
import TopMenuItem from '../../components/TopMenu/TopMenuItem';
import { updateCanvasSize, TUpdateCanvasSize } from '../../model/canvas/canvasActions';
import * as canvasApi from '../../../srcCanvas/api';
import { t } from '../../services/i18n';

type TProps = {
    updateCanvasSize: TUpdateCanvasSize;
    show: boolean,
    disabled: boolean,
};

class MICopyAll extends React.PureComponent<TProps> {
    static readonly defaultProps = {
        show: false,
    };

    onClick = () => {
        canvasApi.copyAllToClipboard();
    };

    render() {
        const { disabled } = this.props;
        return (
            <TopMenuItem
                onClick={this.onClick}
                disabled={disabled}
            >
                {t('menu.copyAll')}
            </TopMenuItem>
        );
    }
}

export default connect(
    () => ({}),
    {
        updateCanvasSize,
    },
)(MICopyAll);
