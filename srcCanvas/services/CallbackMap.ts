import _ from 'lodash';

type Cb = (...args: any) => void;

export class CallbackMap<K = string> {
  private readonly cbMap: Map<K, Cb> = new Map();

  set(key: K, cb: Cb) {
    this.cbMap.set(key, cb);
  }

  call(key: K, ...args: any) {
    const cb = this.cbMap.get(key);
    cb && cb(...args);
  }

  get(key: K): Cb {
    const cb = this.cbMap.get(key);
    return cb ?? _.noop;
  }

  has(key: K): boolean {
    return this.cbMap.has(key);
  }
}
