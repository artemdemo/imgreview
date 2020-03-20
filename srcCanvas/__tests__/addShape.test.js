import { connectArrow } from '../addShape';

jest.mock('../Arrow/Arrow');
jest.mock('../store');

describe('connectShape', () => {
    const ArrowMock = require('../Arrow/Arrow');
    const canvasStoreMock = require('../store').default;

    const stage = {
        instance: null,
    };
    const shapes = {
        layer: {},
    };

    beforeAll(() => {
        jest.clearAllMocks();

        canvasStoreMock.getState.mockReturnValue({
            stage,
            shapes,
        });

        canvasStoreMock.dispatch.mockImplementation(() => {});
    });

    it('should create new Arrow and connect', () => {
        connectArrow();

        expect(ArrowMock.__lastArrowInstance.__props)
            .toEqual([{
                stroke: 'green',
                strokeWidth: undefined,
            }]);

        expect(ArrowMock.__lastArrowInstance.focus).toBeCalledWith()
    });

    it('should use provided instance of Arrow', () => {
        const arrowMock = {
            addToLayer: jest.fn(),
            on: jest.fn(),
            onAnchor: jest.fn(),
            focus: jest.fn(),
        };

        connectArrow(arrowMock);

        expect(arrowMock.addToLayer).toBeCalledWith(shapes.layer);
        expect(arrowMock.on).toBeCalledTimes(4);
        expect(arrowMock.onAnchor).toBeCalledTimes(2);
        expect(arrowMock.focus).toBeCalledWith();
    });
});
