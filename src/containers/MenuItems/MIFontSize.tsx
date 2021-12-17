import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TReduxState } from '../../reducers';
import { TopMenuItem } from '../../components/TopMenu/TopMenuItem';
import { setFontSize, toggleSubmenu } from '../../model/menu/menuActions';
import { TStateMenu } from '../../model/menu/menuReducer';
import * as api from '../../../srcCanvas/api';
import * as gaService from '../../services/ganalytics';
import { EIcon, ImgIcon } from './ImgIcon/ImgIcon';
import ModalClickOutside from '../../components/Modal/ModalClickOutside';

const FONT_SIZE = 'FONT_SIZE';

type Props = {
  disabled?: boolean;
};

export const MIFontSize: React.FC<Props> = (props) => {
  const { disabled } = props;
  const menu = useSelector<TReduxState, TStateMenu>((state) => state.menu);
  const dispatch = useDispatch();

  const handleSubMenuClick = (item: any) => {
    dispatch(setFontSize(item.value));
    api.setFontSizeToActiveShape(item.value);

    gaService.sendEvent({
      eventCategory: gaService.EEventCategories.MenuClick,
      eventAction: gaService.EEventActions.ChangeFontSize,
      eventValue: item.value,
    });
  };

  const createSubmenuItem = (value: number) => {
    return {
      text: `${value}px`,
      value,
      selected: menu.fontSize === value,
      onClick: handleSubMenuClick,
    };
  };

  const handleMenuClick = () => {
    dispatch(toggleSubmenu(menu.openSubmenu === '' ? FONT_SIZE : ''));
  };

  const handleClickOutside = () => {
    if (menu.openSubmenu === FONT_SIZE) {
      // There is weird bug with events propagation,
      // if I'm not wrapping this events dispatching.
      // (User can't add Arrow shape to the scene)
      requestAnimationFrame(() => {
        dispatch(toggleSubmenu(''));
      });
    }
  };

  const values = [12, 14, 16, 18, 20, 25];
  return (
    <ModalClickOutside onClickOutside={handleClickOutside}>
      <TopMenuItem
        subMenu={values.map(createSubmenuItem)}
        open={menu.openSubmenu === FONT_SIZE}
        disabled={disabled}
        onClick={handleMenuClick}
      >
        <ImgIcon icon={EIcon.fontSize} />
      </TopMenuItem>
    </ModalClickOutside>
  );
};
