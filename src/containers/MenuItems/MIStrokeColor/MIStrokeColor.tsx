import React, { useEffect, useContext } from 'react';
import _ from 'lodash';
import dynamic from 'next/dynamic';
import { TopMenuItem } from '../../../components/TopMenu/TopMenuItem';
import {
  showColorPicker,
  setStrokeColor,
} from '../../../model/menu/menuActions';
import * as gaService from '../../../services/ganalytics';
import { t } from '../../../services/i18n';
import IShape from '../../../../srcCanvas/canvasShapes/Shape/IShape';
import EShapeTypes from '../../../../srcCanvas/canvasShapes/Shape/shapeTypes';
import { AppStateContext } from '../../../model/AppStateContext';
import { StrokeColor } from './StrokeColor';

const ColorSelector = dynamic(
  () =>
    import(
      /* webpackChunkName: "ColorSelector" */
      '../../ColorSelector/ColorSelector'
    ),
  { loading: () => null },
);

const getShapeStrokeColor = (shape: IShape): string | undefined => {
  if (_.isFunction(shape.getStrokeColor)) {
    return shape.getStrokeColor();
  }
};

type Props = {
  disabled?: boolean;
};

export const MIStrokeColor: React.FC<Props> = (props) => {
  const { disabled = false } = props;
  const {
    state: {
      menu,
      canvas: { canvasApi },
    },
    dispatch,
  } = useContext(AppStateContext);

  useEffect(() => {
    const handleShapeClicked = (shape: IShape) => {
      const shapeColor = getShapeStrokeColor(shape);
      if (shapeColor) {
        dispatch(setStrokeColor(shapeColor));
      }
    };

    let unsubShapeClicked = _.noop;
    let unsubShapeDragStarted = _.noop;

    if (canvasApi) {
      unsubShapeClicked = canvasApi.onShapeClicked(handleShapeClicked);
      unsubShapeDragStarted = canvasApi.onShapeDragStarted(handleShapeClicked);
    }

    return () => {
      unsubShapeClicked();
      unsubShapeDragStarted();
    };
  }, [canvasApi]);

  return (
    <TopMenuItem
      onClick={() => {
        dispatch(showColorPicker());
      }}
      title={t('menu.strokeColor')}
      disabled={disabled}
    >
      <StrokeColor />
      <ColorSelector
        onChange={(color: string) => {
          dispatch(setStrokeColor(color));
          canvasApi?.setStrokeColorToActiveShape(color);

          gaService.sendEvent({
            eventCategory: gaService.EEventCategories.MenuClick,
            eventAction: gaService.EEventActions.ChangeStrokeColor,
            doNotRepeat: true,
          });
        }}
      />
    </TopMenuItem>
  );
};
