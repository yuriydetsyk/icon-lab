import { TextHelper } from './text.helper';

describe('TextHelper', () => {
  describe('convertToKebabCase', () => {
    it('should convert camelCase string into kebabCase string with dashes', () => {
      expect(TextHelper.convertToKebabCase('test1StringWithDashes')).toBe('test1-string-with-dashes');
      expect(TextHelper.convertToKebabCase('Test2StringWithDashes')).toBe('test2-string-with-dashes');
    });
  });
});
