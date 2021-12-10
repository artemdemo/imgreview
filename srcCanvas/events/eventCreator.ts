type TCbFn<T> = (props: T) => void;
type TUnsubscribeFn = () => void;

interface IEventEmitter<T> {
  (props?: T): void;
  toString: () => string;
  on: (cb: TCbFn<T>) => TUnsubscribeFn;
}

interface ICreateEvent {
  <T>(emitter: any, token: string): IEventEmitter<T>;
}

export const createEvent = <ICreateEvent>(
  function <U>(emitter: any, token: string) {
    const resultFn = <IEventEmitter<U>>function (props: U) {
      emitter.emit(token, props);
    };

    resultFn.toString = () => token;

    resultFn.on = (cb) => {
      return emitter.on(token, cb);
    };

    return resultFn;
  }
);
