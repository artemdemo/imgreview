import _ from 'lodash';
import { OnEvtKey } from '../custom';

type Key = OnEvtKey;
type Cb = (...args: any) => void;

export class CallbackMap {
  private readonly cbMap: Map<Key, Cb> = new Map();

  set(key: Key, cb: Cb) {
    this.cbMap.set(key, cb);
  }

  call(key: Key, ...args: any) {
    const cb = this.cbMap.get(key);
    cb && cb(...args);
  }

  get(key: Key): Cb {
    const cb = this.cbMap.get(key);
    return cb ?? _.noop;
  }

  has(key: Key): boolean {
    return this.cbMap.has(key);
  }
}
