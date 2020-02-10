import React from 'react';
import { connect } from 'react-redux';
import onClickOutside from 'react-click-outside';
import { TReduxState } from '../../reducers';
import Icon from '../../components/Icon/Icon';
import TopMenuItem from '../../components/TopMenu/TopMenuItem';
import { setStrokeWidth, TSetStrokeWidth, toggleSubmenu, TToggleSubmenu } from '../../model/menu/menuActions';
import { TStateMenu } from '../../model/menu/menuReducer';
import * as api from '../../../srcCanvas/api';

const STROKE_WIDTH = 'STROKE_WIDTH';

type Props = {
    menu: TStateMenu;
    setStrokeWidth: TSetStrokeWidth;
    toggleSubmenu: TToggleSubmenu,
    disabled: boolean;
};

class MIStrokeWidth extends React.PureComponent<Props> {
    static readonly defaultProps = {
        disabled: false,
    };

    handleMenuClick = (e) => {
        // There is no specific action on this menu click event.
        // But I don't want to blur selected shape, therefore stopping propagation.
        e.stopPropagation();

        const { toggleSubmenu, menu } = this.props;
        toggleSubmenu(menu.openSubmenu === '' ? STROKE_WIDTH : '');
    };

    handleSubMenuClick = (item, e) => {
        // I'm stopping propagation, because I don't want to blur shapes.
        // Selected shape should stay selected in order to continue to change width.
        e.stopPropagation();

        const { setStrokeWidth } = this.props;
        setStrokeWidth(item.value);
        api.setStrokeWidthToActiveShape(item.value);
    };

    handleClickOutside = () => {
        const { toggleSubmenu } = this.props;
        toggleSubmenu('');
    };

    render() {
        const { menu, disabled } = this.props;
        return (
            <TopMenuItem
                subMenu={[
                    {
                        text: '2px',
                        value: 2,
                        selected: menu.strokeWidth === 2,
                        onClick: this.handleSubMenuClick,
                    },
                    {
                        text: '3px',
                        value: 3,
                        selected: menu.strokeWidth === 3,
                        onClick: this.handleSubMenuClick,
                    },
                    {
                        text: '5px',
                        value: 5,
                        selected: menu.strokeWidth === 5,
                        onClick: this.handleSubMenuClick,
                    },
                    {
                        text: '8px',
                        value: 8,
                        selected: menu.strokeWidth === 8,
                        onClick: this.handleSubMenuClick,
                    },
                ]}
                open={menu.openSubmenu === STROKE_WIDTH}
                disabled={disabled}
                onClick={this.handleMenuClick}
            >
                <Icon
                    name='pencil'
                    title='Size'
                />
            </TopMenuItem>
        );
    }
}

export default connect(
    (state: TReduxState) => ({
        menu: state.menu,
    }),
    {
        setStrokeWidth,
        toggleSubmenu,
    }
)(onClickOutside(MIStrokeWidth));
