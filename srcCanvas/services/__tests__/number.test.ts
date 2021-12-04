import * as number from '../number';

describe('number', () => {
  describe('ensureBetween', () => {
    const min = 0;
    const max = 10;

    it('should return max', () => {
      expect(number.ensureBetween(150, min, max)).toBe(max);
    });

    it('should return min', () => {
      expect(number.ensureBetween(-200, min, max)).toBe(min);
    });

    it('should return value', () => {
      const value = 5;
      expect(number.ensureBetween(value, min, max)).toBe(value);
    });

    it('should return max if min > max', () => {
      const _min = 100;
      const _max = 0;
      expect(number.ensureBetween(-20, _min, _max)).toBe(_max);
      expect(number.ensureBetween(0, _min, _max)).toBe(_max);
      expect(number.ensureBetween(5, _min, _max)).toBe(_max);
      expect(number.ensureBetween(500, _min, _max)).toBe(_max);
    });
  });
});
