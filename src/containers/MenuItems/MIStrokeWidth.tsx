import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { TReduxState } from '../../reducers';
import { TopMenuItem } from '../../components/TopMenu/TopMenuItem';
import ModalClickOutside from '../../components/Modal/ModalClickOutside';
import { setStrokeWidth, toggleSubmenu } from '../../model/menu/menuActions';
import { TStateMenu } from '../../model/menu/menuReducer';
import * as api from '../../../srcCanvas/api';
import * as gaService from '../../services/ganalytics';
import { EIcon, ImgIcon } from './ImgIcon/ImgIcon';
import * as canvasApi from '../../../srcCanvas/api';
import IShape from '../../../srcCanvas/Shape/IShape';
import store from '../../store';
import './MIStrokeWidth.less';

const handleDragStarted = (shape: IShape) => {
  if (_.isFunction(shape.getStrokeWidth)) {
    store.dispatch(setStrokeWidth(shape.getStrokeWidth()));
  }
};

canvasApi.shapeClicked.on(handleDragStarted);
canvasApi.shapeDragStarted.on(handleDragStarted);

const STROKE_WIDTH = 'STROKE_WIDTH';

type Props = {
  disabled: boolean;
  show: boolean;
};

export const MIStrokeWidth: React.FC<Props> = (props) => {
  const menu = useSelector<TReduxState, TStateMenu>((state) => state.menu);
  const dispatch = useDispatch();
  const { disabled, show } = props;

  const handleSubMenuClick = (item: any) => {
    dispatch(setStrokeWidth(item.value));
    api.setStrokeWidthToActiveShape(item.value);

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

  const handleMenuClick = () => {
    dispatch(toggleSubmenu(menu.openSubmenu === '' ? STROKE_WIDTH : ''));
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
        subMenu={values.map(createSubmenuItem)}
        open={menu.openSubmenu === STROKE_WIDTH}
        disabled={disabled}
        show={show}
        onClick={handleMenuClick}
      >
        <span className="MIStrokeWidth__Content">{menu.strokeWidth}px</span>
        <ImgIcon icon={EIcon.strokeWidth} />
      </TopMenuItem>
    </ModalClickOutside>
  );
};
