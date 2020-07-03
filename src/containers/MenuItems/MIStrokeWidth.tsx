import React from 'react';
import { connect } from 'react-redux';
import onClickOutside from 'react-click-outside';
import styled from 'styled-components';
import { TReduxState } from '../../reducers';
import TopMenuItem from '../../components/TopMenu/TopMenuItem';
import { setStrokeWidth, TSetStrokeWidth, toggleSubmenu, TToggleSubmenu } from '../../model/menu/menuActions';
import { TStateMenu } from '../../model/menu/menuReducer';
import * as api from '../../../srcCanvas/api';
import lineThicknessImg from './img/line-thickness.svg';
import * as gaService from "../../services/ganalytics";

const STROKE_WIDTH = 'STROKE_WIDTH';

type TProps = {
    menu: TStateMenu;
    setStrokeWidth: TSetStrokeWidth;
    toggleSubmenu: TToggleSubmenu,
    disabled: boolean;
    show: boolean;
};

const IconThickness = styled.span`
    background-image: url(${lineThicknessImg});
    width: 14px;
    height: 16px;
    background-repeat: no-repeat;
    display: block;
`;

class MIStrokeWidth extends React.PureComponent<TProps> {
    static readonly defaultProps = {
        disabled: false,
        show: false,
    };

    createSubmenuItem = (value: number) => {
        const { menu } = this.props;
        return {
            text: `${value}px`,
            value,
            selected: menu.strokeWidth === value,
            onClick: this.handleSubMenuClick,
        };
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

        gaService.sendEvent({
            eventCategory: gaService.EEventCategories.MenuClick,
            eventAction: gaService.EEventActions.ChangeStrokeWidth,
            eventValue: item.value,
        });
    };

    handleClickOutside = () => {
        const { toggleSubmenu, menu } = this.props;

        if (menu.openSubmenu === STROKE_WIDTH) {
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
            const values = [2, 3, 5, 6, 7, 8, 10];
            return (
                <TopMenuItem
                    subMenu={values.map(this.createSubmenuItem)}
                    open={menu.openSubmenu === STROKE_WIDTH}
                    disabled={disabled}
                    onClick={this.handleMenuClick}
                >
                    <IconThickness />
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
        setStrokeWidth,
        toggleSubmenu,
    }
)(onClickOutside(MIStrokeWidth));
