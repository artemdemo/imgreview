import Shape from './Shape';

interface GeometricShape extends Shape {
    setStrokeWidth(width: number)
}

export default GeometricShape;
