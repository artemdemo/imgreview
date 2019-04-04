import { cursorTypes } from '../canvas/canvasConst';
import { connectArrow } from '../connectShape';

jest.mock('../../canvas/Arrow/Arrow');
jest.mock('../../model/canvas/canvasActions');
jest.mock('../../store');

describe('connectShape', () => {
    const ArrowMock = require('../../canvas/Arrow/Arrow.ts');
    const StoreMock = require('../../store');
    const canvasActionsMock = require('../../model/canvas/canvasActions');

    const canvas = {
        stage: {
            add() {},
        },
    };
    const shapes = {
        strokeColor: '#000',
        strokeWidth: 1
    };

    beforeAll(() => {
        jest.clearAllMocks();

        StoreMock.__setState({
            canvas,
            shapes,
        });
    });

    it('should create new Arrow and connect', () => {
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
            .toEqual([{
                stroke: '#000',
                strokeWidth: 1
            }]);
    });

    it('should use provided instance of Arrow', () => {
        const arrowMock = {
            addToStage: jest.fn(),
            on: jest.fn(),
            onAnchor: jest.fn(),
        };

        connectArrow(arrowMock);

        expect(arrowMock.addToStage).toBeCalledWith(canvas.stage);
        expect(arrowMock.on).toBeCalledTimes(4);
        expect(arrowMock.onAnchor).toBeCalledTimes(2);
    });
});
