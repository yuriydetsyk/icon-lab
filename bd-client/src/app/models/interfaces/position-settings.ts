import { IconDto } from '../dto/icon-dto';
import { ColorData } from './color-data';

export interface PositionSettings {
  icon: IconDto;
  colors: ColorData[];
  rotationAngle: number;
}
