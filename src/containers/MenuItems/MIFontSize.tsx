import React, { useContext } from 'react';
import { TopMenuItem } from '../../components/TopMenu/TopMenuItem';
import { setFontSize, toggleSubmenu } from '../../model/menu/menuActions';
import * as gaService from '../../services/ganalytics';
import { EIcon, ImgIcon } from '../../components/ImgIcon/ImgIcon';
import ModalClickOutside from '../../components/Modal/ModalClickOutside';
import { AppStateContext } from '../../model/AppStateContext';

const FONT_SIZE = 'FONT_SIZE';

type Props = {
  disabled?: boolean;
};

export const MIFontSize: React.FC<Props> = (props) => {
  const { disabled } = props;
  const {
    state: {
      menu,
      canvas: { canvasApi },
    },
    dispatch,
  } = useContext(AppStateContext);

  const handleSubMenuClick = (item: any) => {
    dispatch(setFontSize(item.value));
    canvasApi?.setFontSizeToActiveShape(item.value);

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
      // if I'm not wrapping these events dispatching.
      // (User can't add Arrow shape to the scene)
      requestAnimationFrame(() => {
        dispatch(toggleSubmenu(''));
      });
    }
  };

  const values = [16, 18, 20, 25, 30, 40, 55, 80];
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
