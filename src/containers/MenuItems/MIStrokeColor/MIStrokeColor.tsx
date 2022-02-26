import React, { useContext, useState } from 'react';
import _ from 'lodash';
import dynamic from 'next/dynamic';
import { TopMenuItem } from '../../../components/TopMenu/TopMenuItem';
import { setStrokeColor } from '../../../model/menu/menuActions';
import * as gaService from '../../../services/ganalytics';
import { t } from '../../../services/i18n';
import IShape from '../../../../srcCanvas/canvasShapes/Shape/IShape';
import { AppStateContext } from '../../../model/AppStateContext';
import { StrokeColor } from './StrokeColor';
import { useShapeTouched } from '../../../hooks/useShapeTouched';

const ColorSelector = dynamic(
  () =>
    import(
      /* webpackChunkName: "ColorSelector" */
      '../../ColorSelector/ColorSelector'
    ),
  { loading: () => null, ssr: false },
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
      menu: { strokeColor },
      canvas: { canvasApi },
    },
    dispatch,
  } = useContext(AppStateContext);
  const [showColorPicker, setShowColorPicker] = useState(false);

  useShapeTouched((shape: IShape) => {
    const shapeColor = getShapeStrokeColor(shape);
    if (shapeColor) {
      dispatch(setStrokeColor(shapeColor));
    }
  });

  return (
    <TopMenuItem
      onClick={() => {
        setShowColorPicker(true);
      }}
      title={t('menu.strokeColor')}
      disabled={disabled}
      satellite={
        <ColorSelector
          show={showColorPicker}
          onHide={() => {
            setShowColorPicker(false);
          }}
          color={strokeColor}
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
      }
    >
      <StrokeColor />
    </TopMenuItem>
  );
};
