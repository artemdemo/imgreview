import React, { useContext, useEffect } from 'react';
import _ from 'lodash';
import { TopMenuItem } from '../../components/TopMenu/TopMenuItem';
import ModalClickOutside from '../../components/Modal/ModalClickOutside';
import { setStrokeWidth, toggleSubmenu } from '../../model/menu/menuActions';
import * as gaService from '../../services/ganalytics';
import { EIcon, ImgIcon } from '../../components/ImgIcon/ImgIcon';
import IShape from '../../../srcCanvas/canvasShapes/Shape/IShape';
import './MIStrokeWidth.less';
import { AppStateContext } from '../../model/AppStateContext';

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

  useEffect(() => {
    const handleDragStarted = (shape: IShape) => {
      if (_.isFunction(shape.getStrokeWidth)) {
        dispatch(setStrokeWidth(shape.getStrokeWidth()));
      }
    };

    let unsubShapeClicked = _.noop;
    let unsubShapeDragStarted = _.noop;

    if (canvasApi) {
      unsubShapeClicked = canvasApi.onShapeClicked(handleDragStarted);
      unsubShapeDragStarted = canvasApi.onShapeDragStarted(handleDragStarted);
    }

    return () => {
      unsubShapeClicked();
      unsubShapeDragStarted();
    };
  }, [canvasApi]);

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

  const handleClickOutside = () => {
    if (menu.openSubmenu === STROKE_WIDTH) {
      // There is weird bug with events propagation,
      // if I'm not wrapping these events dispatching.
      // (User can't add Arrow shape to the scene)
      requestAnimationFrame(() => {
        dispatch(toggleSubmenu(''));
      });
    }
  };

  const values = [2, 3, 5, 6, 7, 8, 10];
  return (
    <ModalClickOutside onClickOutside={handleClickOutside}>
      <TopMenuItem
        subMenu={{
          items: values.map(createSubmenuItem),
          token: STROKE_WIDTH,
        }}
        disabled={disabled}
      >
        <span className="MIStrokeWidth__Content">{menu.strokeWidth}px</span>
        <ImgIcon icon={EIcon.strokeWidth} />
      </TopMenuItem>
    </ModalClickOutside>
  );
};
