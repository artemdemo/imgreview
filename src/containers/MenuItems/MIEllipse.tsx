import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TopMenuItem from '../../components/TopMenu/TopMenuItem';
import * as canvasApi from '../../../srcCanvas/api';
import { TReduxState } from '../../reducers';
import { TStateMenu } from '../../model/menu/menuReducer';
import { setShapeToAdd } from '../../model/menu/menuActions';
import * as gaService from '../../services/ganalytics';
import { t } from '../../services/i18n';
import { EIcon, ImgIcon } from './ImgIcon/ImgIcon';

type Props = {
  disabled?: boolean;
};

export const MIEllipse: React.FC<Props> = (props) => {
  const { disabled = false } = props;
  const dispatch = useDispatch();
  const menu = useSelector<TReduxState, TStateMenu>((state) => state.menu);

  const onClick = () => {
    canvasApi.startAddingShape({
      type: canvasApi.EShapeTypes.ELLIPSE,
      options: {
        strokeColor: menu.strokeColor,
        strokeWidth: menu.strokeWidth,
      },
    });

    dispatch(setShapeToAdd(canvasApi.EShapeTypes.ELLIPSE));

    gaService.sendEvent({
      eventCategory: gaService.EEventCategories.MenuClick,
      eventAction: gaService.EEventActions.AddEllipse,
    });
  };

  return (
    <TopMenuItem
      onClick={onClick}
      disabled={disabled}
      active={menu.selectedShapeToAdd === canvasApi.EShapeTypes.ELLIPSE}
      title={t('menu.addEllipse')}
    >
      <ImgIcon icon={EIcon.circle} />
    </TopMenuItem>
  );
};
