import _ from 'lodash';

type Key = string;
type Cb = (...args: any) => void;

export class CallbackMap {
  readonly #cbMap: Map<Key, Cb> = new Map();

  set(key: Key, cb: Cb) {
    this.#cbMap.set(key, cb);
  }

  call(key: Key, ...args: any) {
    const cb = this.#cbMap.get(key);
    cb && cb(...args);
  }

  get(key: Key): Cb {
    const cb = this.#cbMap.get(key);
    return cb ?? _.noop;
  }

  has(key: Key): boolean {
    return this.#cbMap.has(key);
  }
}
