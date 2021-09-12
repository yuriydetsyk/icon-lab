import { Sizes } from '../../models/interfaces/sizes';

export class ImageHelper {
  public static readonly SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
  public static readonly ARTBOARD_SIZE: Sizes = { width: 340, height: 340 };
  public static readonly ARTBOARD_SMALL_SIZE: Sizes = { width: 192, height: 192 }; // used only in double-icon modes
  public static readonly MAIN_ICON_SIZE: Sizes = { width: 156, height: 156 };
  public static readonly SUB_ICON_SIZE: Sizes = { width: 120, height: 120 };
  public static readonly SINGLE_ICON_SIZE: Sizes = { width: 168, height: 168 };
  public static readonly BG_SIZE: Sizes = { width: 340, height: 340 };
  public static readonly PADDING_TOP = 52;
  public static readonly PADDING_TOP_SINGLE = 64;
  // TODO: add better precision (preview differs from the playground version a little bit)
  // temporarily added delta factor instead
  public static readonly DELTA = 2;
  public static readonly ICON_CONTAINER_CSS_CLASS = 'icon-container';
  public static readonly RASTER_IMAGE_CSS_CLASS = 'raster-image';
  public static readonly DOM_ATTRIBUTES = {
    GROUP_ID: 'data-group-id',
  };
  public static readonly DEFAULT_ARTBOARD_NAME = 'untitled';
  public static readonly MAX_ROTATION_ANGLE = 35;

  public static getCssUrl(url: string) {
    return url ? `url('${url}')` : 'none';
  }

  public static getArtboardSize(hasBackground: boolean) {
    return hasBackground ? this.ARTBOARD_SIZE : this.ARTBOARD_SMALL_SIZE;
  }
}
