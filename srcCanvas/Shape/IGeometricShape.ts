import IShape from './IShape';

interface IGeometricShape extends IShape {
    setStrokeWidth(width: number): void
}

export default IGeometricShape;
