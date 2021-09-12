import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';

import { LabService } from '../../../core/services/lab.service';
import { IconType } from '../../../models/enums/icon-type';

@Component({
  selector: 'bd-lab-actions',
  templateUrl: './lab-actions.component.html',
  styleUrls: ['./lab-actions.component.scss'],
})
export class LabActionsComponent implements OnInit, OnDestroy {
  @ViewChild('exportDropdown') public exportDropdown: ElementRef<HTMLDivElement>;

  public exportDropdownOpened = false;
  public IconType = IconType;
  private listenerFn: () => void;

  constructor(private readonly labService: LabService, private readonly renderer: Renderer2) {}

  public ngOnInit() {
    this.listenerFn = this.renderer.listen('window', 'click', (e: Event) => {
      if (!e.composedPath().includes(this.exportDropdown.nativeElement)) {
        this.exportDropdownOpened = false;
      }
    });
  }

  public ngOnDestroy() {
    this.listenerFn();
  }

  public saveToGallery() {}

  public export(type: IconType) {
    this.labService.exportImage(type);
  }
}
