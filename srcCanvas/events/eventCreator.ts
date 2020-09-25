type TCbFun<T> = (props: T) => void;
type TUnsubscribeFun = () => void;

interface IEventEmitter<T> {
    (props?: T): void;
    toString: () => string;
    on: (cb: TCbFun<T>) => TUnsubscribeFun;
}

interface ICreateEvent {
    <T>(emitter, token: string): IEventEmitter<T>;
}

export const createEvent = <ICreateEvent>function<U>(emitter, token) {
    const resultFn = <IEventEmitter<U>>function(props: U) {
        emitter.emit(token, props);
    };

    resultFn.toString = () => token;

    resultFn.on = (cb) => {
        return emitter.on(token, cb);
    };

    return resultFn;
}

