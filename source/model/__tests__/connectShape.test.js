import Arrow from '../../canvas/Arrow/Arrow.ts';
import { cursorTypes } from '../canvas/canvasConst';
import { connectArrow } from '../connectShape';

jest.mock('../../canvas/Arrow/Arrow.ts');
jest.mock('../../model/canvas/canvasActions');
jest.mock('../../store');

describe('connectShape', () => {
    const ArrowMock = require('../../canvas/Arrow/Arrow.ts');
    const StoreMock = require('../../store');
    const canvasActionsMock = require('../../model/canvas/canvasActions');

    beforeAll(() => {
        jest.clearAllMocks();
    });

    it('should connectArrow', () => {
        StoreMock.__setState({
            canvas: {
                stage: {
                    add() {},
                },
            },
        });
        connectArrow(new Arrow({}));

        ArrowMock.__lastArrowInstance.__cbMap.get('mouseover')();
        expect(canvasActionsMock.setCursor).toBeCalledWith(cursorTypes.move);
        ArrowMock.__lastArrowInstance.__cbMap.get('mouseout')();
        expect(canvasActionsMock.setCursor).toBeCalledWith(cursorTypes.auto);
        ArrowMock.__lastArrowInstance.__cbAnchorMap.get('mouseover')();
        expect(canvasActionsMock.setCursor).toBeCalledWith(cursorTypes.pointer);
        ArrowMock.__lastArrowInstance.__cbAnchorMap.get('mouseout')();
        expect(canvasActionsMock.setCursor).toBeCalledWith(cursorTypes.auto);
    });
});
