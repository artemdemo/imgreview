import React, { useContext, useState } from 'react';
import { CanvasMenuEvents } from './CanvasMenuEvents';
import { AppStateContext } from '../../model/AppStateContext';
import IShape from '../../../srcCanvas/canvasShapes/Shape/IShape';
import { hideColorPicker, setShapeToAdd } from '../../model/menu/menuActions';
import { EShapeTypes } from '../../../srcCanvas/api/api-types';
import { TopMenuGroup } from '../../components/TopMenu/TopMenuGroup';
import { MIOpenImage } from '../MenuItems/MIOpenImage';
import { MISave } from '../MenuItems/MISave/MISave';
import { MICopyAll } from '../MenuItems/MICopyAll';
import { MIArrow } from '../MenuItems/MIArrow';
import { MIText } from '../MenuItems/MIText';
import { MIRect } from '../MenuItems/MIRect';
import { MIEllipse } from '../MenuItems/MIEllipse';
import { MIStrokeColor } from '../MenuItems/MIStrokeColor';
import { MIStrokeWidth } from '../MenuItems/MIStrokeWidth';
import { MIFontSize } from '../MenuItems/MIFontSize';
import { MISketchify } from '../MenuItems/MISketchify';
import { MIBringFront } from '../MenuItems/MIBringFront';
import { MISendBack } from '../MenuItems/MISendBack';
import { isDev } from '../../services/env';
import { MIBlankCanvas } from '../MenuItems/MIBlankCanvas';

type State = {
  showStrokeColor: boolean;
  showStrokeWidth: boolean;
  showCrop: boolean;
  showFontSize: boolean;
  showSketchify: boolean;
  showOrderButtons: boolean;
  clickedShapeType: EShapeTypes | undefined;
};

const initState: State = {
  showStrokeColor: false,
  showStrokeWidth: false,
  showCrop: false,
  showFontSize: false,
  showSketchify: false,
  showOrderButtons: false,
  clickedShapeType: undefined,
};

export const CanvasMenu: React.FC = () => {
  const [menuState, setMenuState] = useState<State>({ ...initState });
  const [hasShapes, setHasShapes] = useState<boolean>(false);
  const {
    state: {
      canvas: { canvasApi },
    },
    dispatch,
  } = useContext(AppStateContext);

  const setItemsVisibility = (shape?: IShape) => {
    dispatch(setShapeToAdd());
    dispatch(hideColorPicker());

    const newState = {
      ...initState,
      showOrderButtons: false,
      clickedShapeType: shape?.type,
    };
    switch (shape?.type) {
      case EShapeTypes.ARROW:
      case EShapeTypes.RECT_ROUGH:
      case EShapeTypes.ELLIPSE_ROUGH:
        newState.showStrokeColor = true;
        newState.showStrokeWidth = true;
        break;
      case EShapeTypes.RECT:
      case EShapeTypes.ELLIPSE:
        newState.showStrokeColor = true;
        newState.showStrokeWidth = true;
        newState.showSketchify = true;
        break;
      case EShapeTypes.TEXT:
        newState.showStrokeColor = true;
        newState.showFontSize = true;
        break;
      case EShapeTypes.SELECT_RECT:
        newState.showCrop = true;
        break;
    }
    if (!!shape) {
      newState.showOrderButtons = true;
    }
    setMenuState(newState);
  };

  return (
    <>
      <CanvasMenuEvents
        onShapesAmountChanged={async () => {
          if (canvasApi) {
            const shapesAmount = await canvasApi.getShapesAmount();
            setHasShapes(shapesAmount > 0);
          }
        }}
        onShapeFocus={setItemsVisibility}
      />
      <TopMenuGroup>
        <MIOpenImage />
        <MISave disabled={!hasShapes} />
        <MICopyAll disabled={!hasShapes} />
      </TopMenuGroup>
      <TopMenuGroup>
        <MIArrow />
        <MIText />
        <MIRect />
        <MIEllipse />
      </TopMenuGroup>
      <TopMenuGroup>
        {menuState.showStrokeColor && <MIStrokeColor />}
        {menuState.showStrokeWidth && <MIStrokeWidth />}
        {menuState.showFontSize && <MIFontSize />}
        {menuState.showSketchify && (
          <MISketchify
            reverse={
              menuState.clickedShapeType === EShapeTypes.RECT_ROUGH ||
              menuState.clickedShapeType === EShapeTypes.ELLIPSE_ROUGH
            }
          />
        )}
      </TopMenuGroup>
      {menuState.showOrderButtons && (
        <TopMenuGroup>
          <MIBringFront />
          <MISendBack />
        </TopMenuGroup>
      )}
      {isDev && <MIBlankCanvas />}
    </>
  );
};