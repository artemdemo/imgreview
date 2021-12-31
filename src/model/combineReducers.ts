import _ from 'lodash';

export interface GenericState extends Record<string, any> {}

export type Action = { type: string; payload?: any };

export type Store<S = any> = {
  state: S;
  dispatch: (action: Action) => void;
};

export type Reducer<S> = (state: S, action: Action) => S;

export type ReducersMapObject<S = any> = Record<string, Reducer<S>>;

export function combineReducers<S extends GenericState = any>(
  reducers: ReducersMapObject
): Reducer<S> {
  const reducerKeys = Object.keys(reducers);
  const finalReducers: { [key: string]: Reducer<GenericState> } = {};
  for (const key of reducerKeys) {
    if (_.isUndefined(reducers[key])) {
      throw new Error(`No reducer provided for key "${key}"`);
    }

    if (_.isFunction(reducers[key])) {
      finalReducers[key] = reducers[key];
    }
  }
  const finalReducerKeys = Object.keys(finalReducers);

  return (state: S, action: Action): S => {
    let hasChanged = false;
    const nextState = {} as any;
    for (const key of finalReducerKeys) {
      const reducer = finalReducers[key];
      const previousStateForKey = state[key];
      const nextStateForKey = reducer(previousStateForKey, action);
      if (_.isUndefined(nextStateForKey)) {
        const type = 'type' in action ? action.type : 'undefined';
        throw new Error(`State is undefined for ${key} and action ${type}`);
      }
      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    hasChanged =
      hasChanged || finalReducerKeys.length !== Object.keys(state).length;
    return hasChanged ? nextState : state;
  };
}
