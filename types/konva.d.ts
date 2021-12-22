declare module 'konva' {
  import CanvasImage from '../srcCanvas/Image/CanvasImage';
  type TPos = {
    x: number;
    y: number;
  };

  export class Path {
    attrs: TPos;

    constructor(pathParams: {
      data: string;
      stroke: string;
      strokeWidth?: number;
      lineCap?: string;
      lineJoin?: string;
      draggable?: boolean;
    });

    on(evtStr: string, cb: (e?: any) => void): void;
    setData(pathStr: string): void;
    setAttr(attrStr: string, data: any): void;
    getAttr(key: string): any;
    setAttrs(data: { x?: number; y?: number; width?: number; scaleX?: number });
    draw(): void;
    destroy(): void;
  }

  export class Circle {
    constructor(params: {
      x?: number;
      y?: number;
      stroke?: string;
      width?: number;
      height?: number;
      fill?: string;
      strokeWidth?: number;
      draggable?: boolean;
      visible?: boolean;
      dash?: number[];
      dragBoundFunc?: (pos: any) => void;
    });

    on(evtStr: string, cb: (e?: any) => void): void;
    setAttr(key: string, value: any);
    getAttrs(): any;
    getAttr(key: string): any;
    setAttrs(attrs: {
      x?: number;
      y?: number;
      width?: number;
      height?: number;
      scaleX?: number;
    }): any;
    draw(): void;
    destroy(): void;
    visible(visibleStatus: boolean): void;
    hide(): void;
    show(): void;
  }

  export class Ellipse {
    constructor(params: {
      x?: number;
      y?: number;
      stroke?: string;
      width?: number;
      height?: number;
      fill?: string;
      strokeWidth?: number;
      draggable?: boolean;
      visible?: boolean;
      dash?: number[];
      dragBoundFunc?: (pos: any) => void;
    });

    on(evtStr: string, cb: (e?: any) => void);
    setAttr(key: string, value: any);
    getAttr(key: string): any;
    getAttrs(): any;
    setAttrs(attrs: {
      x?: number;
      y?: number;
      width?: number;
      height?: number;
      scaleX?: number;
    }): any;
    draw(): void;
    destroy(): void;
    visible(visibleStatus: boolean): void;
    hide(): void;
    show(): void;
  }

  /**
   * https://konvajs.org/api/Konva.Rect.html
   */
  export class Rect {
    constructor(params: {
      x?: number;
      y?: number;
      stroke?: string;
      width?: number;
      height?: number;
      fill?: string;
      strokeWidth?: number;
      draggable?: boolean;
      visible?: boolean;
      dash?: number[];
      dragBoundFunc?: (pos: any) => void;
    });

    on(evtStr: string, cb: (e?: any) => void);
    setAttr(key: string, value: any);
    getAttrs(): any;
    getAttr(key: string): any;
    setAttrs(attrs: {
      x?: number;
      y?: number;
      width?: number;
      height?: number;
      scaleX?: number;
      stroke?: string;
      strokeWidth?: number;
    }): any;
    draw(): void;
    destroy(): void;
    visible(visibleStatus: boolean): void;
    hide(): void;
    show(): void;
  }

  export class Text {
    placeholder: string;
    attrs: {
      x: number;
      y: number;
      text: string;
    };
    parent: any;
    constructor(params: {
      text: string;
      x: number;
      y: number;
      fontSize?: number;
      fontFamily?: string;
      draggable: boolean;
      width: number;
    });
    on(evtStr: string, cb: (e?: any) => void);
    setAttr(key: string, value: any);
    getAttr(key: string): any;
    getAttrs(): any;
    setAttrs(attrs: {
      x?: number;
      y?: number;
      width?: number;
      height?: number;
      scaleX?: number;
    });
    width(): number;
    height(): number;
    padding(): number;
    scaleX(): number;
    lineHeight(): string;
    hide(): void;
    show(): void;
    text(value?: string): string;
    fontFamily(): string;
    fontSize(): number;
    align(): string;
    fill(): string;
    rotation(): number;
    position(pos?: TPos): TPos;
    absolutePosition(pos?: TPos): TPos;
    getAbsoluteScale(): TPos;
    destroy(): void;
  }

  type TransformerNode = Text | Rect | Image;

  /**
   * https://konvajs.org/api/Konva.Transformer.html
   */
  export class Transformer {
    constructor(params?: {
      node?: TransformerNode;
      nodes?: TransformerNode[];
      enabledAnchors?: string[];
      boundBoxFunc?: (oldBox: any, newBox: any) => any;
      borderStroke?: string;
      borderStrokeWidth?: number;
      anchorStroke?: string;
      anchorFill?: string;
      anchorStrokeWidth?: number;
      ignoreStroke?: boolean;
    });
    getAttrs();
    hide(): void;
    show(): void;
    nodes(nodes: TransformerNode[]): TransformerNode[];
    forceUpdate(): void;
    destroy(): void;
  }

  type TStageAttrs = {
    width: number;
    height: number;
  };

  type TCropAttrs = {
    x: number;
    y: number;
    width: number;
    height: number;
  };

  type ToDataUrlConfig = {
    // can be "image/png" or "image/jpeg".
    // "image/png" is the default
    mimeType?: string;
    // x position of canvas section
    x?: number;
    // y position of canvas section
    y?: number;
    width?: number;
    height?: number;
    // jpeg quality. If using an "image/jpeg" mimeType,
    // you can specify the quality from 0 to 1, where 0 is very poor quality and 1
    // is very high quality
    quality?: number;
    // pixelRatio of output image url. Default is 1.
    // You can use that property to increase quality of the image, for example for super hight quality exports
    // or usage on retina (or similar) displays. pixelRatio will be used to multiply the size of exported image.
    // If you export to 500x500 size with pixelRatio = 2, then produced image will have size 1000x1000.
    pixelRatio?: number;
  }

  export class Stage {
    attrs: TStageAttrs;
    constructor(params: {
      container: HTMLDivElement | HTMLSpanElement | null;
      width?: number;
      height?: number;
      draggable?: boolean;
    });
    toDataURL(config?: ToDataUrlConfig);
    setAttr(attrName: string, value: any);
    absolutePosition(pos?: TPos): TPos;
    setAttrs(data: {
      x?: number;
      y?: number;
      width?: number;
      height?: number;
      scaleX?: number;
    });
    getAttrs(): TStageAttrs;
    draggable(value?: boolean): boolean;
    add(layer: Layer): void;
    container(): HTMLDivElement;
    draw(): void;
    on(evtStr: string, cb: (e?: any) => void): void;
  }

  export class Image {
    static fromURL(dataUrl, cb: (img: Image) => void): void;

    constructor(params);

    getSize(): void;
    setSize(width: number, height: number): void;
    x(value?: number): number;
    y(value?: number): number;
    setAttrs(data: {
      x?: number;
      y?: number;
      width?: number;
      height?: number;
      scaleX?: number;
    });
    getAttr(key: string): any;
    setAttr(attrName: string, value: any): void;
    getAttrs(): any;
    cropX(x: number): void;
    cropY(y: number): void;
    cropWidth(width: number): void;
    cropHeight(height: number): void;
    width(width?: number): number;
    height(height?: number): number;
    crop(attrs: TCropAttrs): TCropAttrs;
    destroy(): void;
    on(evtStr: string, cb: (e?: any) => void): void;
  }

  export class Line {
    constructor(params?: {
      lineCap?: string;
      lineJoin?: string;
      stroke?: string;
      strokeWidth?: number;
      points?: number[];
    });

    on(evtStr: string, cb: (e?: any) => void): void;
    getAttr(key: string): any;
    setAttr(attrName: string, value: any): void;
    setAttrs(data: { x?: number; y?: number; strokeWidth?: number }): void;
    setPoints(points: number[]): void;
    draw(): void;
    destroy(): void;
  }

  export class Shape {
    constructor(params?: {
      x?: number;
      y?: number;
      stroke?: string;
      width?: number;
      height?: number;
      fill?: string;
      strokeWidth?: number;
      draggable?: boolean;
      visible?: boolean;
      dragBoundFunc?: (pos: any) => void;
      sceneFunc(context, shape): void;
    });

    on(evtStr: string, cb: (e?: any) => void);
    setAttr(key: string, value: any);
    getAttrs(): any;
    getAttr(key: string): any;
    setAttrs(attrs: {
      x?: number;
      y?: number;
      width?: number;
      height?: number;
      scaleX?: number;
      stroke?: string;
      strokeWidth?: number;
    }): any;
    draw(): void;
    destroy(): void;
    visible(visibleStatus: boolean): void;
    hide(): void;
    show(): void;
  }

  export class Layer {
    parent: Stage;
    constructor(params?: { name?: string });

    add(entity: Path | Circle | Transformer | Text | Image | Line): void;
    clear(): void;
    toDataURL(config?: ToDataUrlConfig);
    draw(): void;
    on(evtStr: string, cb: (e?: any) => void): void;
    off(evtStr: string, cb: (e?: any) => void): void;
    moveToBottom(): void;
    getCanvas();
    getContext(): CanvasRenderingContext2D;
    clone(): Layer;
    toDataURL();
    destroy(): void;
  }
}
