import { Component, Input } from '@angular/core';

import { IconDto } from '../../../models/dto/icon-dto';
import { IconType } from '../../../models/enums/icon-type';
import { ImageHelper } from '../../helpers/image.helper';

@Component({
  selector: 'bd-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent {
  @Input() public icon: IconDto;
  @Input() public large = false;
  public active = false;
  public ImageHelper = ImageHelper;
  public IconType = IconType;
}
