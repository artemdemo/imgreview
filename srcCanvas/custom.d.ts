export type TPos = {
  x: number;
  y: number;
};

export type BoundariesRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type IntersectRect = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

export type OnEvtKey =
  | 'click'
  | 'dragstart'
  | 'dragmove'
  | 'dragend'
  | 'mouseover'
  | 'mouseout'
  | 'mousedown'
  | 'mouseup'
  | 'mousemove'
  // custom events (doesn't exist on konva)
  | '_anchordragstart'
  | '_anchordragmove';
