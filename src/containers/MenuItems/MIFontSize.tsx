import React, { useContext } from 'react';
import { TopMenuItem } from '../../components/TopMenu/TopMenuItem';
import { setFontSize, toggleSubmenu } from '../../model/menu/menuActions';
import * as gaService from '../../services/ganalytics';
import ModalClickOutside from '../../components/Modal/ModalClickOutside';
import { AppStateContext } from '../../model/AppStateContext';
import { MenuInput } from '../../components/TopMenu/MenuInput';

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

  const handleSubmit = (value: string) => {
    const intValue = parseInt(value, 10);
    const newFontSize = Number.isNaN(intValue)
      ? menu.fontSize
      : Math.min(200, Math.max(0, intValue));
    dispatch(setFontSize(newFontSize));
    canvasApi?.setFontSizeToActiveShape(newFontSize);

    gaService.sendEvent({
      eventCategory: gaService.EEventCategories.MenuClick,
      eventAction: gaService.EEventActions.ChangeFontSize,
    });

    dispatch(toggleSubmenu(''));
  };

  const createSubmenuItem = (value: number) => {
    return {
      text: `${value}px`,
      value,
      selected: menu.fontSize === value,
      onClick: (item: any) => {
        handleSubmit(item.value);
      },
    };
  };

  const values = [16, 18, 20, 25, 30, 40, 55, 80];
  return (
    <ModalClickOutside
      onClickOutside={() => {
        if (menu.openSubmenu === FONT_SIZE) {
          // There is weird bug with events propagation,
          // if I'm not wrapping these events dispatching.
          // (User can't add Arrow shape to the scene)
          requestAnimationFrame(() => {
            dispatch(toggleSubmenu(''));
          });
        }
      }}
    >
      <TopMenuItem
        subMenu={values.map(createSubmenuItem)}
        open={menu.openSubmenu === FONT_SIZE}
        disabled={disabled}
        onClick={() => {
          dispatch(toggleSubmenu(menu.openSubmenu === '' ? FONT_SIZE : ''));
        }}
      >
        <MenuInput
          displayValue={String(menu.fontSize)}
          onSubmit={handleSubmit}
        />{' '}
        px
      </TopMenuItem>
    </ModalClickOutside>
  );
};
