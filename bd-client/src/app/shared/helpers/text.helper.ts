export class TextHelper {
  public static readonly DEFAULT_DEBOUNCE_TIME = 800;

  public static convertToKebabCase(str: string) {
    return `${str.slice(0, 1).toLowerCase()}${str.slice(1).replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())}`;
  }
}
