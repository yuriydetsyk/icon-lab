import { Component, OnInit } from '@angular/core';
import { IconStyleService } from '../../../../core/services/icon-style.service';

import { IconStyle } from '../../../../models/interfaces/icon-style';
import { DataHelper } from '../../../../shared/helpers/data.helper';

@Component({
  selector: 'bd-tab-styles',
  templateUrl: './tab-styles.component.html',
  styleUrls: ['./tab-styles.component.scss'],
})
export class TabStylesComponent implements OnInit {
  public styles: IconStyle[] = [
    {
      id: 'some-id',
      name: 'Bubbly Icons',
      url: 'https://img.icon-lab.co/styles/bubbly-icons.png',
    },
  ];
  public DataHelper = DataHelper;

  constructor(private readonly iconStyleService: IconStyleService) {}

  public ngOnInit() {
    // TODO: check if we still need this
    this.setStyle(this.styles[0]);
  }

  public trackStylesFn(_: number, item: IconStyle) {
    return item.id;
  }

  public setStyle(style: IconStyle) {
    this.iconStyleService.setStyle(style);
  }
}
