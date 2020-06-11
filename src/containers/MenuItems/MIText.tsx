import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentAlt } from '@fortawesome/free-solid-svg-icons';
import TopMenuItem from '../../components/TopMenu/TopMenuItem';
import * as shapesService from '../../services/shapes';
import * as canvasApi from '../../../srcCanvas/api';
import { TReduxState } from '../../reducers';
import { TStateMenu } from '../../model/menu/menuReducer';

type TProps = {
    disabled: boolean;
    menu: TStateMenu,
};

class MIText extends React.PureComponent<TProps> {
    static readonly defaultProps = {
        disabled: false,
    };

    onClick = (e) => {
        // Parent <Menu> will blur shapes, but it will happened _after_ I add new arrow.
        // I don'nt want ot menu to handle blurring, since I want that new arrow will stay in focus.
        e.stopPropagation();

        // And here I'm blurring shapes by myself,
        // since I want it to occur _before_ I'm adding new one.
        shapesService.blurShapes();

        const { menu } = this.props;
        canvasApi.createShape(
            canvasApi.EShapeTypes.TEXT,
            {
                fillColor: menu.strokeColor,
                fontSize: menu.fontSize,
            },
        );
    };

    render() {
        const { disabled } = this.props;
        return (
            <TopMenuItem
                onClick={this.onClick}
                disabled={disabled}
            >
                <FontAwesomeIcon icon={faCommentAlt} />
            </TopMenuItem>
        );
    }
}

export default connect(
    (state: TReduxState) => ({
        menu: state.menu,
    })
)(MIText);
