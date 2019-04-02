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

    export class Layer {}
}
