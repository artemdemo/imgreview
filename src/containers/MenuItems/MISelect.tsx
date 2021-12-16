import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TopMenuItem from '../../components/TopMenu/TopMenuItem';
import * as canvasApi from '../../../srcCanvas/api';
import * as gaService from '../../services/ganalytics';
import { setShapeToAdd } from '../../model/menu/menuActions';
import { t } from '../../services/i18n';
import { TReduxState } from '../../reducers';
import { TStateMenu } from '../../model/menu/menuReducer';
import { EIcon, ImgIcon } from './ImgIcon/ImgIcon';

type Props = {
  disabled?: boolean;
};

export const MISelect: React.FC<Props> = (props) => {
  const { disabled = false } = props;
  const dispatch = useDispatch();
  const menu = useSelector<TReduxState, TStateMenu>((state) => state.menu);

  const onClick = () => {
    canvasApi.startAddingShape({
      type: canvasApi.EShapeTypes.SELECT_RECT,
    });

    dispatch(setShapeToAdd(canvasApi.EShapeTypes.SELECT_RECT));

    gaService.sendEvent({
      eventCategory: gaService.EEventCategories.MenuClick,
      eventAction: gaService.EEventActions.AddSelectRect,
    });
  };

  return (
    <TopMenuItem
      onClick={onClick}
      disabled={disabled}
      active={menu.selectedShapeToAdd === canvasApi.EShapeTypes.SELECT_RECT}
      title={t('menu.select')}
    >
      <ImgIcon icon={EIcon.rectSelect} />
    </TopMenuItem>
  );
};
