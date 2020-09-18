import React from 'react';
import { connect } from 'react-redux';
import onClickOutside from 'react-click-outside';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFont } from '@fortawesome/free-solid-svg-icons';
import { TReduxState } from '../../reducers';
import TopMenuItem from '../../components/TopMenu/TopMenuItem';
import { setFontSize, TSetStrokeWidth, toggleSubmenu, TToggleSubmenu } from '../../model/menu/menuActions';
import { TStateMenu } from '../../model/menu/menuReducer';
import * as api from '../../../srcCanvas/api';
import * as gaService from "../../services/ganalytics";

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

    createSubmenuItem = (value: number) => {
        const { menu } = this.props;
        return {
            text: `${value}px`,
            value,
            selected: menu.fontSize === value,
            onClick: this.handleSubMenuClick,
        };
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

        gaService.sendEvent({
            eventCategory: gaService.EEventCategories.MenuClick,
            eventAction: gaService.EEventActions.ChangeFontSize,
            eventValue: item.value,
        });
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
        const values = [12, 14, 16, 18, 20, 25];
        return (
            <TopMenuItem
                subMenu={values.map(this.createSubmenuItem)}
                open={menu.openSubmenu === FONT_SIZE}
                disabled={disabled}
                show={show}
                onClick={this.handleMenuClick}
            >
                <FontAwesomeIcon
                    icon={faFont}
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
        setFontSize,
        toggleSubmenu,
    }
)(onClickOutside(MIFontSize));
