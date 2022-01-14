import React, { useContext, useEffect, useRef, useState } from 'react';
import { MIOpenImage } from '../MenuItems/MIOpenImage';
import { MISave } from '../MenuItems/MISave/MISave';
import { MICopyAll } from '../MenuItems/MICopyAll';
import { MIArrow } from '../MenuItems/MIArrow';
import { MIText } from '../MenuItems/MIText';
import { MIRect } from '../MenuItems/MIRect';
import { MIEllipse } from '../MenuItems/MIEllipse';
import { MISketchify } from '../MenuItems/MISketchify';
import { MIStrokeColor } from '../MenuItems/MIStrokeColor';
import { MIStrokeWidth } from '../MenuItems/MIStrokeWidth';
import { MIFontSize } from '../MenuItems/MIFontSize';
import { MIGithub } from '../MenuItems/MIGithub';
import { MIBlankCanvas } from '../MenuItems/MIBlankCanvas';
import { MIAbout } from '../MenuItems/MIAbout';
import TopMenuPanel from '../../components/TopMenu/TopMenuPanel';
import FloatRight from '../../components/Floating/FloatRight';
import {
  setMenuHeight,
  setShapeToAdd,
  hideColorPicker,
} from '../../model/menu/menuActions';
import { isDev } from '../../services/env';
import { EShapeTypes } from '../../../srcCanvas/api/api-types';
import { TopMenuGroup } from '../../components/TopMenu/TopMenuGroup';
import { AppStateContext } from '../../model/AppStateContext';
import IShape from '../../../srcCanvas/canvasShapes/Shape/IShape';
import { MenuCanvasEvents } from './MenuCanvasEvents';
import { MIBringFront } from '../MenuItems/MIBringFront';
import { MISendBack } from '../MenuItems/MISendBack';

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

export const Menu: React.FC = () => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuState, setMenuState] = useState<State>({ ...initState });
  const [hasShapes, setHasShapes] = useState<boolean>(false);
  const {
    state: {
      canvas: { canvasApi },
    },
    dispatch,
  } = useContext(AppStateContext);

  useEffect(() => {
    const { offsetHeight } = menuRef.current || {};
    if (offsetHeight) {
      dispatch(setMenuHeight(offsetHeight));
    }
  }, []);

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
      <MenuCanvasEvents
        onShapesAmountChanged={async () => {
          if (canvasApi) {
            const shapesAmount = await canvasApi.getShapesAmount();
            setHasShapes(shapesAmount > 0);
          }
        }}
        onShapeFocus={setItemsVisibility}
      />
      <TopMenuPanel
        onClick={() => {
          canvasApi?.blurShapes();
        }}
        ref={menuRef}
      >
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
        <FloatRight>
          <MIAbout />
          <MIGithub />
        </FloatRight>
      </TopMenuPanel>
    </>
  );
};
