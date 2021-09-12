import { Component } from '@angular/core';

import { BackgroundService } from '../../../core/services/background.service';
import { LabService } from '../../../core/services/lab.service';
import { IconPosition } from '../../../models/enums/icon-position';
import { ImageHelper } from '../../../shared/helpers/image.helper';

@Component({
  selector: 'bd-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss'],
})
export class PlaygroundComponent {
  public IconPosition = IconPosition;
  public availablePositions$ = this.labService.availablePositionsChanged;
  public backgroundColor$ = this.backgroundService.backgroundColorChanged;
  public get artboardSize() {
    return ImageHelper.getArtboardSize(!!this.backgroundService.background);
  }

  constructor(private readonly labService: LabService, private readonly backgroundService: BackgroundService) {}

  public getIcon(position: IconPosition) {
    return this.labService.getIcon(position);
  }
}
