import React, { useContext, useEffect, useState } from 'react';
import _ from 'lodash';
import dynamic from 'next/dynamic';
import classnames from 'classnames';
import Color from 'color';
import { TopMenuItem } from '../../components/TopMenu/TopMenuItem';
import { setFillColor } from '../../model/menu/menuActions';
import * as gaService from '../../services/ganalytics';
import IShape from '../../../srcCanvas/canvasShapes/Shape/IShape';
import { AppStateContext } from '../../model/AppStateContext';
import { useShapeTouched } from '../../hooks/useShapeTouched';
import s from './MIFillColor.module.css';
import { t } from '../../services/i18n';

const ColorSelector = dynamic(
  () =>
    import(
      /* webpackChunkName: "ColorSelector" */
      '../ColorSelector/ColorSelector'
    ),
  { loading: () => null, ssr: false },
);

const getShapeFillColor = (shape: IShape): string | undefined => {
  if (_.isFunction(shape.getFillColor)) {
    return shape.getFillColor();
  }
};

type Props = {
  disabled?: boolean;
};

export const MIFillColor: React.FC<Props> = (props) => {
  const { disabled = false } = props;
  const {
    state: {
      menu: { fillColor },
      canvas: { canvasApi },
    },
    dispatch,
  } = useContext(AppStateContext);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isTransparent, setIsTransparent] = useState(false);

  useEffect(() => {
    setIsTransparent(Color(fillColor).alpha() < 0.25);
  }, [fillColor]);

  useShapeTouched((shape: IShape) => {
    const shapeColor = getShapeFillColor(shape);
    if (shapeColor) {
      dispatch(setFillColor(shapeColor));
    }
  });

  return (
    <TopMenuItem
      onClick={() => {
        setShowColorPicker(true);
      }}
      title={t('menu.fillColor')}
      disabled={disabled}
      satellite={
        <ColorSelector
          show={showColorPicker}
          onHide={() => {
            setShowColorPicker(false);
          }}
          color={fillColor}
          onChange={(color: string) => {
            dispatch(setFillColor(color));
            canvasApi?.setFillColorToActiveShape(color);

            gaService.sendEvent({
              eventCategory: gaService.EEventCategories.MenuClick,
              eventAction: gaService.EEventActions.ChangeFillColor,
              doNotRepeat: true,
            });
          }}
        />
      }
    >
      <div
        className={classnames({
          [s.FillColor]: true,
          [s.FillColor_isTransparent]: isTransparent,
        })}
        style={{ backgroundColor: fillColor }}
      />
    </TopMenuItem>
  );
};
