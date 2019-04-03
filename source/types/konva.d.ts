declare module 'konva' {
    export class Path {
        constructor(pathParams: {
            stroke: string,
            strokeWidth: string,
            data: string,
            lineCap: string,
            lineJoin: string,
            draggable: boolean,
        })
    }

    export class Circle {
        constructor(params: {
            x: number,
            y: number,
            radius: number,
            stroke: string,
            fill: string,
            strokeWidth: number,
            draggable: boolean,
            visible: boolean,
        })
    }

    export class Layer {}
}
