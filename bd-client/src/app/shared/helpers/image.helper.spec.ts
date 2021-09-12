import { ImageHelper } from './image.helper';

describe('ImageHelper', () => {
  describe('getCssUrl', () => {
    it('should return a CSS-friendly url', () => {
      const url = 'test-url';
      expect(ImageHelper.getCssUrl(url)).toBe(`url('${url}')`);
    });

    it('should return an empty CSS url, if original url is empty', () => {
      expect(ImageHelper.getCssUrl(null)).toBe('none');
    });
  });
});
