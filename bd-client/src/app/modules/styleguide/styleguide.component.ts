import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IconService } from '../../core/services/icon.service';

import { IconDto } from '../../models/dto/icon-dto';
import { Color } from '../../models/enums/color';
import { TabId } from '../../models/enums/tab-id';
import { NavTab } from '../../models/interfaces/nav-tab';

@Component({
  selector: 'bd-styleguide',
  templateUrl: './styleguide.component.html',
  styleUrls: ['./styleguide.component.scss'],
})
export class StyleguideComponent implements OnInit {
  public form: FormGroup;
  public tabs: NavTab[] = [
    {
      id: TabId.Avatars,
      title: 'Avatars',
    },
    {
      id: TabId.Icons,
      title: 'Icons',
      hover: true,
    },
    {
      id: TabId.Test,
      title: 'Test',
      active: true,
    },
  ];
  public icons: IconDto[] = [];
  public iconPlaceholder = { url: '../../assets/images/icon_placeholder.svg' } as any;
  public dropdownItems: { key: number; value: string }[] = [
    { key: 1, value: 'Category #1' },
    { key: 2, value: 'Category #2' },
    { key: 3, value: 'Category #3' },
  ];

  constructor(private readonly fb: FormBuilder, private readonly iconService: IconService) {}

  public ngOnInit() {
    this.iconService.getIcons().subscribe((data) => (this.icons = data.slice(0, 2)));

    this.form = this.fb.group({
      inputNormal: 'icon-name',
      inputHover: 'icon-name',
      inputActive: 'icon-name',
      searchNormal: null,
      searchHover: null,
      searchActive: 'Text',
      colorNormal: Color.Yellow,
      colorHover: Color.Yellow,
      dropdown: null,
    });
  }
}
