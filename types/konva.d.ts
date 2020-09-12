declare module 'konva' {
    type TPos = {
        x: number;
        y: number;
    };

    export class Path {
        attrs: TPos;

        constructor(pathParams: {
            data: string,
            stroke: string,
            strokeWidth?: number,
            lineCap?: string,
            lineJoin?: string,
            draggable?: boolean,
        })

        on(evtStr: string, cb: (e?: any) => void)
        setData(pathStr: string)
        setAttr(attrStr: string, data: any)
        setAttrs(data: {
            x?: number;
            y?: number;
            width?: number;
            scaleX?: number;
        })
        draw()
        destroy()
    }

    export class Circle {
        constructor(params: {
            x?: number,
            y?: number,
            stroke?: string,
            width?: number,
            height?: number,
            fill?: string,
            strokeWidth?: number,
            draggable?: boolean,
            visible?: boolean,
            dash?: number[],
            dragBoundFunc?: (pos: any) => void,
        })

        on(evtStr: string, cb: (e?: any) => void)
        setAttr(key: string, value: any);
        getAttrs(): any
        setAttrs(attrs: {
            x?: number;
            y?: number;
            width?: number;
            height?: number;
            scaleX?: number;
        }): any
        draw()
        destroy()
        visible(visibleStatus: boolean)
    }

    export class Ellipse {
        constructor(params: {
            x?: number,
            y?: number,
            stroke?: string,
            width?: number,
            height?: number,
            fill?: string,
            strokeWidth?: number,
            draggable?: boolean,
            visible?: boolean,
            dash?: number[],
            dragBoundFunc?: (pos: any) => void,
        })

        on(evtStr: string, cb: (e?: any) => void)
        setAttr(key: string, value: any);
        getAttrs(): any
        setAttrs(attrs: {
            x?: number;
            y?: number;
            width?: number;
            height?: number;
            scaleX?: number;
        }): any
        draw()
        destroy()
        visible(visibleStatus: boolean)
    }

    /**
     * https://konvajs.org/api/Konva.Rect.html
     */
    export class Rect {
        constructor(params: {
            x?: number,
            y?: number,
            stroke?: string,
            width?: number,
            height?: number,
            fill?: string,
            strokeWidth?: number,
            draggable?: boolean,
            visible?: boolean,
            dash?: number[],
            dragBoundFunc?: (pos: any) => void,
        })

        on(evtStr: string, cb: (e?: any) => void)
        setAttr(key: string, value: any);
        getAttrs(): any
        setAttrs(attrs: {
            x?: number;
            y?: number;
            width?: number;
            height?: number;
            scaleX?: number;
        }): any
        draw()
        destroy()
        visible(visibleStatus: boolean)
    }

    export class Text {
        placeholder: string;
        attrs: {
            x: number;
            y: number;
            text: string;
        };
        parent: any;
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
        setAttrs(attrs: {
            x?: number;
            y?: number;
            width?: number;
            height?: number;
            scaleX?: number;
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
        position(pos?: TPos): TPos
        absolutePosition(pos?: TPos): TPos
        getAbsoluteScale(): TPos
        destroy(): void
    }

    /**
     * https://konvajs.org/api/Konva.Transformer.html
     */
    export class Transformer {
        constructor(params: {
            node: Text | Rect;
            enabledAnchors: string[];
            boundBoxFunc?: (oldBox: any, newBox: any) => any;
            borderStroke?: string,
            borderStrokeWidth?: number;
            anchorStroke?: string,
            anchorFill?: string,
            anchorStrokeWidth?: number;
            ignoreStroke?: boolean;
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
        setAttrs(data: {
            x?: number;
            y?: number;
            width?: number;
            height?: number;
            scaleX?: number;
        })
        getAttrs(): TStageAttrs
        add(layer: Layer)
        container(): HTMLDivElement
        draw()
        on(evtStr: string, cb: (e?: any) => void)
    }

    export class Image {
        constructor(params)

        getSize()
        setSize(width: number, height: number)
        cropX(x: number)
        cropY(y: number)
        cropWidth(width: number)
        cropHeight(height: number)
        width(width?: number): number
        height(height?: number): number
        destroy()
    }

    export class Layer {
        parent: Stage;

        add(entity: Path | Circle | Transformer | Text | Image)
        clear()
        draw()
        on(evtStr: string, cb: (e?: any) => void)
        off(evtStr: string, cb: (e?: any) => void)
        moveToBottom()
        destroy()
    }
}
