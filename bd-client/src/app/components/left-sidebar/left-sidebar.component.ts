import { Component } from '@angular/core';
import { MenuItem } from '../../models/interfaces/menu-item';

@Component({
  selector: 'bd-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss'],
})
export class LeftSidebarComponent {
  public menuItems: MenuItem[] = [
    {
      title: 'Icon Lab',
      className: 'lab',
      url: 'lab',
    },
    {
      title: 'Collection',
      className: 'collection',
      url: 'collection',
    },
    {
      title: 'Feedback',
      className: 'support',
      url: 'feedback',
    },
  ];
}
