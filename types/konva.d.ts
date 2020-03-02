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

    export class Text {
        placeholder: string;
        constructor(params: {
            text: string;
            x: number;
            y: number;
            fontSize: number;
            draggable: boolean;
            width: number;
        })
        on(evtStr: string, cb: (e?: any) => void)
        setAttr(key: string, value: any);
        getAttr(key: string): any;
        setAttrs(data: {
            width: number;
            scaleX: number;
        })
        width(): number;
        height(): number;
        padding(): number;
        scaleX(): number;
        lineHeight(): string;
        hide(): void;
        show(): void;
        text(value?: string): string;
        fontFamily(): string;
        fontSize(): number;
        align(): string;
        fill(): string;
        rotation(): number;
        absolutePosition(): { x: number, y: number }
        getAbsoluteScale(): { x: number, y: number }
        destroy(): void
    }

    export class Transformer {
        constructor(params: {
            node: Text;
            enabledAnchors: string[];
            boundBoxFunc: (oldBox: any, newBox: any) => any;
        })
        hide(): void
        show(): void
        forceUpdate(): void
        destroy(): void
    }

    type TStageAttrs = {
        width: number;
        height: number;
    };

    export class Stage {
        attrs: TStageAttrs;
        constructor(params: {
            container: HTMLDivElement | HTMLSpanElement | null,
            width?: number,
            height?: number,
        })
        toDataURL()
        setAttr(attrName: string, value: any)
        getAttrs(): TStageAttrs
        add(layer: Layer)
        container(): HTMLDivElement
    }

    export class Image {
        constructor()

        getSize()

        setSize(width: number, height: number)
    }

    export class Layer {
        parent: Stage;

        add(entity: Path | Circle)

        clear()

        draw()

        on(evtStr: string, cb: (e?: any) => void)

        off(evtStr: string, cb: (e?: any) => void)

        destroy()
    }
}
