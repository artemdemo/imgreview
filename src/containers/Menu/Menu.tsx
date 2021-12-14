import React from 'react';
import { connect } from 'react-redux';
import { TReduxState } from '../../reducers';
import { MIOpenImage } from '../MenuItems/MIOpenImage';
import { MISave } from '../MenuItems/MISave/MISave';
import { MICopyAll } from '../MenuItems/MICopyAll';
import MIArrow from '../MenuItems/MIArrow';
import MIText from '../MenuItems/MIText';
import { MICrop } from '../MenuItems/MICrop';
import MISelect from '../MenuItems/MISelect';
import MIRect from '../MenuItems/MIRect';
import MICircle from '../MenuItems/MIEllipse';
import { MISketchify } from '../MenuItems/MISketchify';
import MIStrokeColor from '../MenuItems/MIStrokeColor';
import MIStrokeWidth from '../MenuItems/MIStrokeWidth';
import MIResize from '../MenuItems/MIResize/MIResize';
import MIFontSize from '../MenuItems/MIFontSize';
import { MIGithub } from '../MenuItems/MIGithub';
import MIBlankCanvas from '../MenuItems/MIBlankCanvas';
import { MIAbout } from '../MenuItems/MIAbout';
import TopMenuPanel from '../../components/TopMenu/TopMenuPanel';
import FloatRight from '../../components/Floating/FloatRight';
import { TStateCanvas } from '../../model/canvas/canvasReducer';
import {
  setMenuHeight,
  TSetMenuHeight,
  setShapeToAdd,
  TSetShapeToAdd,
  hideColorPicker,
  THideColorPicker,
} from '../../model/menu/menuActions';
import { isDev } from '../../services/env';
import * as canvasApi from '../../../srcCanvas/api';
import { Separator } from '../../components/TopMenu/Separator';

type Props = {
  canvas: TStateCanvas;
  setMenuHeight: TSetMenuHeight;
  setShapeToAdd: TSetShapeToAdd;
  hideColorPicker: THideColorPicker;
};

type State = {
  showStrokeColor: boolean;
  showStrokeWidth: boolean;
  showSketchify: boolean;
  clickedShapeType: canvasApi.EShapeTypes | undefined;
};

class Menu extends React.PureComponent<Props, State> {
  #menuRef = React.createRef<HTMLDivElement>();
  #unsubShapesBlurred: (() => void) | undefined;
  #unsubShapeClicked: (() => void) | undefined;
  #unsubShapeAdded: (() => void) | undefined;

  state = {
    showStrokeColor: false,
    showStrokeWidth: false,
    showCrop: false,
    showFontSize: false,
    showSketchify: false,
    clickedShapeType: undefined,
  };

  componentDidMount(): void {
    const { setMenuHeight } = this.props;
    const { offsetHeight } = this.#menuRef.current || {};
    if (offsetHeight) {
      setMenuHeight(offsetHeight);
    }

    this.#unsubShapesBlurred = canvasApi.shapesBlurred.on(
      this.setItemsVisibility
    );

    this.#unsubShapeClicked = canvasApi.shapeClicked.on(
      (shape: canvasApi.TShapeClicked) => {
        requestAnimationFrame(() => this.setItemsVisibility(shape));
      }
    );

    this.#unsubShapeAdded = canvasApi.shapeAdded.on(
      (shape: canvasApi.TShapeAdded) => {
        this.setItemsVisibility(shape);
      }
    );
  }

  componentWillUnmount(): void {
    this.#unsubShapesBlurred!();
    this.#unsubShapeClicked!();
    this.#unsubShapeAdded!();
  }

  setItemsVisibility = (shape: canvasApi.TShapesBlurred) => {
    const { setShapeToAdd, hideColorPicker } = this.props;
    setShapeToAdd();
    hideColorPicker();

    const newState = {
      showStrokeColor: false,
      showStrokeWidth: false,
      showCrop: false,
      showFontSize: false,
      showSketchify: false,
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
    this.setState(newState);
  };

  handleMenuClick = () => {
    canvasApi.blurShapes();
  };

  render() {
    const { canvas } = this.props;
    const disabled = canvas.height === 0 && canvas.width === 0;
    return (
      <TopMenuPanel onClick={this.handleMenuClick} ref={this.#menuRef}>
        <MIOpenImage />
        <MISave disabled={disabled} />
        <MICopyAll disabled={disabled} />
        <Separator />
        <MIArrow disabled={disabled} />
        <MIText disabled={disabled} />
        <MIRect disabled={disabled} />
        <MICircle disabled={disabled} />
        <MISelect disabled={disabled} />
        <Separator />
        <MICrop disabled={disabled} show={this.state.showCrop} />
        <MIStrokeColor disabled={disabled} show={this.state.showStrokeColor} />
        <MIStrokeWidth disabled={disabled} show={this.state.showStrokeWidth} />
        <MIFontSize disabled={disabled} show={this.state.showFontSize} />
        <MISketchify
          disabled={disabled}
          show={this.state.showSketchify}
          reverse={
            this.state.clickedShapeType === canvasApi.EShapeTypes.RECT_ROUGH ||
            this.state.clickedShapeType === canvasApi.EShapeTypes.ELLIPSE_ROUGH
          }
        />
        <Separator
          show={
            this.state.showStrokeColor ||
            this.state.showFontSize ||
            this.state.showCrop
          }
        />
        <MIResize disabled={disabled} />
        <MIBlankCanvas show={isDev} />
        <FloatRight>
          {/*<MIAbout />*/}
          <MIGithub />
        </FloatRight>
      </TopMenuPanel>
    );
  }
}

export default connect(
  (state: TReduxState) => ({
    canvas: state.canvas,
  }),
  {
    setMenuHeight,
    setShapeToAdd,
    hideColorPicker,
  }
)(Menu);
