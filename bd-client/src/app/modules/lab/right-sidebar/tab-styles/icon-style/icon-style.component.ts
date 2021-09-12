import { Component, Input } from '@angular/core';

import { IconStyleService } from '../../../../../core/services/icon-style.service';
import { IconStyle } from '../../../../../models/interfaces/icon-style';
import { ImageHelper } from '../../../../../shared/helpers/image.helper';

@Component({
  selector: 'bd-icon-style',
  templateUrl: './icon-style.component.html',
  styleUrls: ['./icon-style.component.scss'],
})
export class IconStyleComponent {
  @Input() public style: IconStyle;
  @Input() public active = false;
  public ImageHelper = ImageHelper;

  constructor(private readonly iconStyleService: IconStyleService) {}

  public isActive(style: IconStyle) {
    return this.iconStyleService.isActive(style);
  }
}
