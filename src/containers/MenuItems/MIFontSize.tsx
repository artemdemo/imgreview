import React, { useCallback, useContext, useRef } from 'react';
import { TopMenuItem } from '../../components/TopMenu/TopMenuItem';
import { setFontSize, toggleSubmenu } from '../../model/menu/menuActions';
import * as gaService from '../../services/ganalytics';
import { AppStateContext } from '../../model/AppStateContext';
import { MenuInput } from '../../components/TopMenu/MenuInput';
import { useClickOutside } from '../../hooks/useClickOutside';

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
  const baseRef = useRef<HTMLElement>(null);

  useClickOutside(
    baseRef,
    useCallback(() => {
      if (menu.openSubmenu === FONT_SIZE) {
        // There is weird bug with events propagation,
        // if I'm not wrapping these events dispatching.
        // (User can't add Arrow shape to the scene)
        requestAnimationFrame(() => {
          dispatch(toggleSubmenu(''));
        });
      }
    }, [menu]),
  );

  const handleSubmit = (value: string) => {
    const intValue = parseInt(value, 10);
    const newFontSize = Number.isNaN(intValue)
      ? menu.fontSize
      : Math.min(200, Math.max(10, intValue));
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
    <TopMenuItem
      subMenu={{
        items: values.map(createSubmenuItem),
        token: FONT_SIZE,
      }}
      disabled={disabled}
      ref={baseRef}
    >
      <MenuInput
        displayValue={String(menu.fontSize)}
        onSubmit={handleSubmit}
        suffix="px"
      />
    </TopMenuItem>
  );
};
