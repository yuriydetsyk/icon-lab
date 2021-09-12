import { BackgroundDto } from '../../models/dto/background-dto';
import { IconDto } from '../../models/dto/icon-dto';
import { IconType } from '../../models/enums/icon-type';

export class IconHelper {
  public static mapBackgroundToIcon(bg: BackgroundDto): IconDto {
    if (!bg) {
      return bg as IconDto;
    }
    return { ...bg, type: IconType.Vector, isPremium: false };
  }
}
