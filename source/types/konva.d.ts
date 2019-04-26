declare module 'konva' {
    export class Path {
        attrs: {
            x: number;
            y: number;
        };

        constructor(pathParams: {
            stroke: string,
            strokeWidth: number,
            data: string,
            lineCap: string,
            lineJoin: string,
            draggable: boolean,
        })

        on(evtStr: string, cb: (e?: any) => void)

        setData(pathStr: string)

        setAttr(attrStr: string, data: any)

        draw()

        destroy()
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

    export class Stage {
        constructor(params: {
            container: HTMLDivElement | HTMLSpanElement | null,
        })
    }

    export class Layer {
        add(entity: Path | Circle)

        clear()

        destroy()
    }
}
