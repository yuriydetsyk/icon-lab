import { ArrayHelper } from './array.helper';

describe('ArrayHelper', () => {
  describe('groupBy', () => {
    it('should group objects array by selected field', () => {
      const key1 = 'key1';
      const key2 = 'key2';
      const key3 = 'key3';
      const arr = [
        { a: key1, b: 'test1' },
        { a: key1, b: 'test2' },
        { a: key2, b: 'test1' },
        { a: key2, b: 'test2' },
        { a: key2, b: 'test3' },
        { a: key3, b: 'test1' },
        { a: key3, b: 'test2' },
        { a: key3, b: 'test3' },
        { a: key3, b: 'test4' },
      ];

      const res = ArrayHelper.groupBy(arr, (item) => item.a);

      expect(res[key1].length).toBe(2);
      expect(res[key2].length).toBe(3);
      expect(res[key3].length).toBe(4);
      expect(res[key1]).toEqual(arr.filter((item) => item.a === key1));
      expect(res[key2]).toEqual(arr.filter((item) => item.a === key2));
      expect(res[key3]).toEqual(arr.filter((item) => item.a === key3));
    });
  });

  describe('unique', () => {
    it('should return array of unique objects by the selected field', () => {
      const key1 = 'key1';
      const key2 = 'key2';
      const key3 = 'key3';
      const value1 = 'test1';
      const value2 = 'test2';
      const value3 = 'test3';
      const value4 = 'test4';
      const arr = [
        { a: key1, b: value1 },
        { a: key1, b: value2 },
        { a: key2, b: value1 },
        { a: key2, b: value2 },
        { a: key2, b: value3 },
        { a: key3, b: value1 },
        { a: key3, b: value2 },
        { a: key3, b: value3 },
        { a: key3, b: value4 },
      ];

      const res = ArrayHelper.unique(arr, (item) => item.a);

      expect(res.length).toBe(3);
      expect(res.find((item) => item.a === key1)).toEqual({ a: key1, b: value1 });
      expect(res.find((item) => item.a === key2)).toEqual({ a: key2, b: value1 });
      expect(res.find((item) => item.a === key3)).toEqual({ a: key3, b: value1 });
    });
  });
});
