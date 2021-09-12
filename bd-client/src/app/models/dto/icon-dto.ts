import { IconType } from '../enums/icon-type';
import { CategoryDto } from './category-dto';

export interface IconDto {
  id: string;
  name: string;
  tags?: string[];
  url: string;
  type: IconType;
  isPremium: boolean;
  categories?: CategoryDto[];
  createdAt: Date;
  updatedAt?: Date;
}
