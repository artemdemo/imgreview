import React, { useCallback, useContext, useRef } from 'react';
import _ from 'lodash';
import { TopMenuItem } from '../../components/TopMenu/TopMenuItem';
import { setStrokeWidth, toggleSubmenu } from '../../model/menu/menuActions';
import * as gaService from '../../services/ganalytics';
import { EIcon, ImgIcon } from '../../components/ImgIcon/ImgIcon';
import IShape from '../../../srcCanvas/canvasShapes/Shape/IShape';
import { AppStateContext } from '../../model/AppStateContext';
import s from './MIStrokeWidth.module.css';
import { useClickOutside } from '../../hooks/useClickOutside';
import { t } from '../../services/i18n';
import { ShapeTouched } from './helpers/ShapeTouched';

const STROKE_WIDTH = 'STROKE_WIDTH';

type Props = {
  disabled?: boolean;
};

export const MIStrokeWidth: React.FC<Props> = (props) => {
  const { disabled = false } = props;
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
      if (menu.openSubmenu === STROKE_WIDTH) {
        // There is weird bug with events propagation,
        // if I'm not wrapping these events dispatching.
        // (User can't add Arrow shape to the scene)
        requestAnimationFrame(() => {
          dispatch(toggleSubmenu(''));
        });
      }
    }, [menu]),
  );

  const handleSubMenuClick = (item: any) => {
    dispatch(setStrokeWidth(item.value));
    canvasApi?.setStrokeWidthToActiveShape(item.value);

    gaService.sendEvent({
      eventCategory: gaService.EEventCategories.MenuClick,
      eventAction: gaService.EEventActions.ChangeStrokeWidth,
    });
  };

  const createSubmenuItem = (value: number) => {
    return {
      text: `${value}px`,
      value,
      selected: menu.strokeWidth === value,
      onClick: handleSubMenuClick,
    };
  };

  const values = [2, 3, 5, 6, 7, 8, 10];
  return (
    <TopMenuItem
      subMenu={{
        items: values.map(createSubmenuItem),
        token: STROKE_WIDTH,
      }}
      disabled={disabled}
      title={t('menu.strokeWidth')}
      ref={baseRef}
    >
      <ShapeTouched
        onTouched={(shape: IShape) => {
          if (_.isFunction(shape.getStrokeWidth)) {
            dispatch(setStrokeWidth(shape.getStrokeWidth()));
          }
        }}
      />
      <span className={s.MIStrokeWidth__Content}>{menu.strokeWidth}px</span>
      <ImgIcon icon={EIcon.strokeWidth} />
    </TopMenuItem>
  );
};
