/* eslint-disable prefer-template */
import { createAction } from '../actionCreator';

describe('actionCreator', () => {
    describe('createAction()', () => {
        it('should create action with constant', () => {
            const actionConst = 'SOME_ACTION';
            const action = createAction(actionConst);
            expect(action()).toEqual({
                type: actionConst,
            });
        });

        it('toString() of action should return constant', () => {
            const actionConst = 'SOME_ACTION';
            const action = createAction(actionConst);
            expect(String(action) === actionConst).toBe(true);
            expect(('' + action) === actionConst).toBe(true);
            expect(`${action}` === actionConst).toBe(true);
        });

        it('should use callback action', () => {
            const actionConst = 'SOME_ACTION';
            const action = createAction(actionConst, smth => ({ smth }));
            const data = 'some data';
            expect(action(data)).toEqual({
                type: actionConst,
                smth: data,
            });
        });

        it('should rewrite type', () => {
            const actionConst = 'SOME_ACTION';
            const newActionConst = 'NEW_ACTION';
            const action = createAction(actionConst, smth => ({ smth, type: newActionConst }));
            const data = 'some data';
            expect(action(data)).toEqual({
                type: newActionConst,
                smth: data,
            });
        });
    });
});
