import { cursorTypes } from '../../source/model/canvas/canvasConst';
import { connectArrow } from '../addShape';

jest.mock('../Arrow/Arrow');
jest.mock('../../model/canvas/canvasActions');
jest.mock('../store');

describe('connectShape', () => {
    const ArrowMock = require('../Arrow/Arrow');
    const canvasStoreMock = require('../store').default;
    const canvasActionsMock = require('../../source/model/canvas/canvasActions');

    const stage = {
        instance: null,
    };

    beforeAll(() => {
        jest.clearAllMocks();

        canvasStoreMock.getState.mockReturnValue({
            stage,
        });

        canvasStoreMock.dispatch.mockImplementation(() => {});
    });

    it('should create new Arrow and connect', () => {
        connectArrow();

        expect(ArrowMock.__lastArrowInstance.__props)
            .toEqual([{
                stroke: undefined,
                strokeWidth: undefined,
            }]);
    });

    it('should use provided instance of Arrow', () => {
        const arrowMock = {
            addToStage: jest.fn(),
            on: jest.fn(),
            onAnchor: jest.fn(),
        };

        connectArrow(arrowMock);

        expect(arrowMock.addToStage).toBeCalledWith(stage.instance);
        expect(arrowMock.on).toBeCalledTimes(4);
        expect(arrowMock.onAnchor).toBeCalledTimes(2);
    });
});
