import React from 'react';
import TopMenuItem from '../../components/TopMenu/TopMenuItem';
import * as canvasApi from '../../../srcCanvas/api';
import { t } from '../../services/i18n';

type TProps = {
    disabled: boolean;
    show: boolean;
};

class MISketchify extends React.PureComponent<TProps> {
    static readonly defaultProps = {
        disabled: false,
        show: false,
    };

    onClick = (e) => {
        // There is no specific action on this menu click event.
        // But I don't want to blur selected shape, therefore stopping propagation.
        e.stopPropagation();

        canvasApi.sketchifyActiveShape();
    };

    render() {
        const { disabled, show } = this.props;
        return (
            <TopMenuItem
                onClick={this.onClick}
                disabled={disabled}
                show={show}
            >
                {t('menu.sketchify')}
            </TopMenuItem>
        );
    }
}

export default MISketchify;
