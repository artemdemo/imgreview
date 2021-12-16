import IShape from './IShape';

interface IGeometricShape extends IShape {
  setStrokeWidth(width: number): void;
  getStrokeWidth(): number;

  clone(): IGeometricShape;
}

export default IGeometricShape;
