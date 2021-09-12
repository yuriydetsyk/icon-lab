import { IconPosition } from '../enums/icon-position';

export interface ColorExtendedData extends ColorData {
  position: IconPosition;
}

export interface ColorData {
  index: string;
  color: string;
}
