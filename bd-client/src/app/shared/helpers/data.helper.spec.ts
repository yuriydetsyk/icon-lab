import { DataHelper } from './data.helper';

describe('DataHelper', () => {
  describe('formatBytes', () => {
    it('should return a formatted size based on input bytes', () => {
      expect(DataHelper.formatBytes(1024)).toBe('1 KB');
      expect(DataHelper.formatBytes(1280)).toBe('1.25 KB');
      expect(DataHelper.formatBytes(1310000)).toBe('1.25 MB');
      expect(DataHelper.formatBytes(1310000, 5)).toBe('1.24931 MB');
    });
  });

  describe('isEqual', () => {
    it('should compare two equal objects', () => {
      const obj1 = { test: 2, arr: [{ item: 124 }] };
      const obj2 = { test: 2, arr: [{ item: 124 }] };
      expect(DataHelper.isEqual(obj1, obj2)).toBeTruthy();
    });

    it('should compare two unequal objects', () => {
      const obj1 = { test: 2, arr: [{ item: 124 }] };
      const obj2 = { test: 2, arr: [{ item: 124, a: '324' }] };
      expect(DataHelper.isEqual(obj1, obj2)).toBeFalsy();
    });
  });

  describe('removeEmpty', () => {
    it('should remove empty keys without values', () => {
      const obj: any = { test: 2, arr: [{ item: 124 }], c: undefined, d: null };
      expect(DataHelper.removeEmpty(obj)).toEqual({ test: 2, arr: [{ item: 124 }] });
    });
  });
});
