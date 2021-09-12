import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { LabService } from '../../../core/services/lab.service';
import { LayoutMode } from '../../../models/enums/layout-mode';

@Component({
  selector: 'bd-layout-selector',
  templateUrl: './layout-selector.component.html',
  styleUrls: ['./layout-selector.component.scss'],
})
export class LayoutSelectorComponent {
  public layoutModes = [LayoutMode.Single, LayoutMode.BottomRight, LayoutMode.BottomLeft];

  constructor(private readonly labService: LabService) {}

  public setMode(mode: LayoutMode) {
    this.labService.setLayoutMode(mode);
  }

  public isActive(layoutMode: LayoutMode) {
    return this.labService.layoutModeChanged.pipe(map(({ mode }) => mode === layoutMode));
  }
}
