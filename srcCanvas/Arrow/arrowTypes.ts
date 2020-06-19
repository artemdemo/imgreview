import {TPos} from "konva";

export interface IAnchorsCoordinates {
    start: TPos;
    control: TPos;
    end: TPos;
}

export interface IAnchorsPosition extends IAnchorsCoordinates {
    angles: {
        start: number,
        control: number,
        end: number,
    },
}
