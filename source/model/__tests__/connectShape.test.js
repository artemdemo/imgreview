import { cursorTypes } from '../canvas/canvasConst';
import { connectArrow } from '../connectShape';

jest.mock('../../canvas/Arrow/Arrow');
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
        const shapes = {
            stroke: '#000',
            strokeWidth: 1
        };

        StoreMock.__setState({
            canvas: {
                stage: {
                    add() {},
                },
            },
            shapes,
        });

        connectArrow();

        ArrowMock.__lastArrowInstance.__cbMap.get('mouseover')();
        expect(canvasActionsMock.setCursor).toBeCalledWith(cursorTypes.move);
        ArrowMock.__lastArrowInstance.__cbMap.get('mouseout')();
        expect(canvasActionsMock.setCursor).toBeCalledWith(cursorTypes.auto);
        ArrowMock.__lastArrowInstance.__cbAnchorMap.get('mouseover')();
        expect(canvasActionsMock.setCursor).toBeCalledWith(cursorTypes.pointer);
        ArrowMock.__lastArrowInstance.__cbAnchorMap.get('mouseout')();
        expect(canvasActionsMock.setCursor).toBeCalledWith(cursorTypes.auto);

        expect(ArrowMock.__lastArrowInstance.__props)
            .toEqual([shapes]);
    });
});
