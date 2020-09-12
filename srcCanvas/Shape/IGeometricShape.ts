import IShape from './IShape';

interface IGeometricShape extends IShape {
    setStrokeWidth(width: number): void

    clone(): IGeometricShape
}

export default IGeometricShape;
