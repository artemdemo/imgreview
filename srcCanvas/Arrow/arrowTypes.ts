export type TCoordinate = {
    x: number,
    y: number,
}

export interface IAnchorsCoordinates {
    start: TCoordinate;
    control: TCoordinate;
    end: TCoordinate;
}

export interface IAnchorsPosition extends IAnchorsCoordinates {
    angles: {
        start: number,
        control: number,
        end: number,
    },
}
