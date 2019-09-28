export type TCoordinate = {
    x: number,
    y: number,
}

export type TAnchorsPosition = {
    start: TCoordinate;
    control: TCoordinate;
    end: TCoordinate;
    angles?: {
        start: number,
        control: number,
        end: number,
    },
}
