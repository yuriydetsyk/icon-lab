import { Component, Input } from '@angular/core';

import { Notification } from '../../../models/interfaces/notification';

@Component({
  selector: 'bd-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent {
  @Input() public items: Notification[] = [];
}
