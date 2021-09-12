import { Component } from '@angular/core';

import { LabService } from '../../../../../core/services/lab.service';
import { IconDto } from '../../../../../models/dto/icon-dto';

@Component({
  selector: 'bd-recently-used',
  templateUrl: './recently-used.component.html',
  styleUrls: ['./recently-used.component.scss'],
})
export class RecentlyUsedComponent {
  public recentIcons$ = this.labService.recentIconsChanged;

  constructor(private readonly labService: LabService) {}

  public trackIconsFn(_: number, item: IconDto) {
    return item.id;
  }

  public setIcon(icon: IconDto) {
    this.labService.setIcon(icon);
  }
}
