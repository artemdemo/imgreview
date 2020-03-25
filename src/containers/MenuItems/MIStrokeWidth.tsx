import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/pro-light-svg-icons';
import onClickOutside from 'react-click-outside';
import { TReduxState } from '../../reducers';
import TopMenuItem from '../../components/TopMenu/TopMenuItem';
import { setStrokeWidth, TSetStrokeWidth, toggleSubmenu, TToggleSubmenu } from '../../model/menu/menuActions';
import { TStateMenu } from '../../model/menu/menuReducer';
import * as api from '../../../srcCanvas/api';

const STROKE_WIDTH = 'STROKE_WIDTH';

type TProps = {
    menu: TStateMenu;
    setStrokeWidth: TSetStrokeWidth;
    toggleSubmenu: TToggleSubmenu,
    disabled: boolean;
    show: boolean;
};

class MIStrokeWidth extends React.PureComponent<TProps> {
    static readonly defaultProps = {
        disabled: false,
        show: false,
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
                    <FontAwesomeIcon icon={faPencil} />
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
