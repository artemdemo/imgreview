import IShape from './IShape';

interface IGeometricShape extends IShape {
    setStrokeWidth(width: number)
}

export default IGeometricShape;
