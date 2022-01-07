import React, { useContext, useEffect, useRef, useState } from 'react';
import { MIOpenImage } from '../MenuItems/MIOpenImage';
import { MISave } from '../MenuItems/MISave/MISave';
import { MICopyAll } from '../MenuItems/MICopyAll';
import { MIArrow } from '../MenuItems/MIArrow';
import { MIText } from '../MenuItems/MIText';
import { MISelect } from '../MenuItems/MISelect';
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
import * as canvasApi from '../../../srcCanvas/api';
import IShape from '../../../srcCanvas/canvasShapes/Shape/IShape';
import { TopMenuGroup } from '../../components/TopMenu/TopMenuGroup';
import { AppStateContext } from '../../model/AppStateContext';

// I need to keep reference to previous data,
// so when user is going to another page (for example "About") and back,
// I'll be able to set correct availability of relevant items.
// ToDo: It should be solved by new version of CanvasApi, which methods will return values.
let hasShapesInit = false;

type State = {
  showStrokeColor: boolean;
  showStrokeWidth: boolean;
  showCrop: boolean;
  showFontSize: boolean;
  showSketchify: boolean;
  clickedShapeType: canvasApi.EShapeTypes | undefined;
};

const initState: State = {
  showStrokeColor: false,
  showStrokeWidth: false,
  showCrop: false,
  showFontSize: false,
  showSketchify: false,
  clickedShapeType: undefined,
};

export const Menu: React.FC = () => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuState, setMenuState] = useState<State>({ ...initState });
  const [hasShapes, setHasShapes] = useState<boolean>(hasShapesInit);
  const { dispatch } = useContext(AppStateContext);

  const setItemsVisibility = (shape: IShape) => {
    dispatch(setShapeToAdd());
    dispatch(hideColorPicker());

    const newState = {
      ...initState,
      clickedShapeType: shape?.type,
    };
    switch (shape?.type) {
      case canvasApi.EShapeTypes.ARROW:
      case canvasApi.EShapeTypes.RECT_ROUGH:
      case canvasApi.EShapeTypes.ELLIPSE_ROUGH:
        newState.showStrokeColor = true;
        newState.showStrokeWidth = true;
        break;
      case canvasApi.EShapeTypes.RECT:
      case canvasApi.EShapeTypes.ELLIPSE:
        newState.showStrokeColor = true;
        newState.showStrokeWidth = true;
        newState.showSketchify = true;
        break;
      case canvasApi.EShapeTypes.TEXT:
        newState.showStrokeColor = true;
        newState.showFontSize = true;
        break;
      case canvasApi.EShapeTypes.SELECT_RECT:
        newState.showCrop = true;
        break;
    }
    setMenuState(newState);
  };

  useEffect(() => {
    hasShapesInit = hasShapes;
  }, [hasShapes]);

  useEffect(() => {
    const { offsetHeight } = menuRef.current || {};
    if (offsetHeight) {
      dispatch(setMenuHeight(offsetHeight));
    }

    const unsubShapesBlurred = canvasApi.shapesBlurred.on(setItemsVisibility);
    const unsubShapeClicked = canvasApi.shapeClicked.on((shape) => {
      requestAnimationFrame(() => setItemsVisibility(shape));
    });
    const unsubShapeDragStared = canvasApi.shapeDragStarted.on((shape) => {
      requestAnimationFrame(() => setItemsVisibility(shape));
    });
    const unsubShapeAdded = canvasApi.shapeAdded.on(
      ({ addedShape, shapesList }) => {
        setItemsVisibility(addedShape);
        setHasShapes(shapesList.length > 0);
      },
    );
    const unsubShapeDeleted = canvasApi.shapeDeleted.on(({ shapesList }) => {
      setHasShapes(shapesList.length > 0);
    });

    return () => {
      unsubShapesBlurred();
      unsubShapeClicked();
      unsubShapeDragStared();
      unsubShapeAdded();
      unsubShapeDeleted();
    };
  }, []);

  return (
    <TopMenuPanel
      onClick={() => {
        canvasApi.blurShapes();
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
        {/*<MISelect />*/}
      </TopMenuGroup>
      <TopMenuGroup>
        {menuState.showStrokeColor && <MIStrokeColor />}
        {menuState.showStrokeWidth && <MIStrokeWidth />}
        {menuState.showFontSize && <MIFontSize />}
        {menuState.showSketchify && (
          <MISketchify
            reverse={
              menuState.clickedShapeType === canvasApi.EShapeTypes.RECT_ROUGH ||
              menuState.clickedShapeType === canvasApi.EShapeTypes.ELLIPSE_ROUGH
            }
          />
        )}
      </TopMenuGroup>
      {isDev && <MIBlankCanvas />}
      <FloatRight>
        <MIAbout />
        <MIGithub />
      </FloatRight>
    </TopMenuPanel>
  );
};
