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
        attrs: {
            width: number;
            height: number;
        };

        constructor(params: {
            container: HTMLDivElement | HTMLSpanElement | null,
            width?: number,
            height?: number,
        })

        toDataURL()

        setAttr(attrName: string, value: any)
    }

    export class Image {
        constructor()

        getSize()

        setSize(width: number, height: number)
    }

    export class Layer {
        add(entity: Path | Circle)

        clear()

        on(evtStr: string, cb: (e?: any) => void)

        off(evtStr: string, cb: (e?: any) => void)

        destroy()
    }
}
