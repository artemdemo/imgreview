import React from 'react';
import { connect } from 'react-redux';
import onClickOutside from 'react-click-outside';
import { TReduxState } from '../../reducers';
import Icon from '../../components/Icon/Icon';
import TopMenuItem from '../../components/TopMenu/TopMenuItem';
import { setFontSize, TSetStrokeWidth, toggleSubmenu, TToggleSubmenu } from '../../model/menu/menuActions';
import { TStateMenu } from '../../model/menu/menuReducer';
import * as api from '../../../srcCanvas/api';

const FONT_SIZE = 'FONT_SIZE';

type TProps = {
    menu: TStateMenu;
    setFontSize: TSetStrokeWidth;
    toggleSubmenu: TToggleSubmenu,
    disabled: boolean;
    show: boolean;
};

class MIFontSize extends React.PureComponent<TProps> {
    static readonly defaultProps = {
        disabled: false,
        show: false,
    };

    handleMenuClick = (e) => {
        // There is no specific action on this menu click event.
        // But I don't want to blur selected shape, therefore stopping propagation.
        e.stopPropagation();

        const { toggleSubmenu, menu } = this.props;
        toggleSubmenu(menu.openSubmenu === '' ? FONT_SIZE : '');
    };

    handleSubMenuClick = (item, e) => {
        // I'm stopping propagation, because I don't want to blur shapes.
        // Selected shape should stay selected in order to continue to change width.
        e.stopPropagation();

        const { setFontSize } = this.props;
        setFontSize(item.value);
        api.setFontSizeToActiveShape(item.value);
    };

    handleClickOutside = () => {
        const { toggleSubmenu, menu } = this.props;

        if (menu.openSubmenu === FONT_SIZE) {
            // There is weird bug with events propagation,
            // if I'm not wrapping this events dispatching.
            // (User can't add Arrow shape to the scene)
            requestAnimationFrame(() => {
                toggleSubmenu('');
            });
        }
    };

    render() {
        const { menu, disabled, show } = this.props;
        if (show) {
            return (
                <TopMenuItem
                    subMenu={[
                        {
                            text: '16px',
                            value: 16,
                            selected: menu.fontSize === 16,
                            onClick: this.handleSubMenuClick,
                        },
                        {
                            text: '18px',
                            value: 18,
                            selected: menu.fontSize === 18,
                            onClick: this.handleSubMenuClick,
                        },
                        {
                            text: '20px',
                            value: 20,
                            selected: menu.fontSize === 20,
                            onClick: this.handleSubMenuClick,
                        },
                        {
                            text: '25px',
                            value: 25,
                            selected: menu.fontSize === 25,
                            onClick: this.handleSubMenuClick,
                        },
                    ]}
                    open={menu.openSubmenu === FONT_SIZE}
                    disabled={disabled}
                    onClick={this.handleMenuClick}
                >
                    <Icon
                        name='font'
                        title='Font Size'
                    />
                </TopMenuItem>
            );

        }
        return null;
    }
}

export default connect(
    (state: TReduxState) => ({
        menu: state.menu,
    }),
    {
        setFontSize,
        toggleSubmenu,
    }
)(onClickOutside(MIFontSize));
