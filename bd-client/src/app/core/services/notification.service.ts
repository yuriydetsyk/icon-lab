import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Notification } from '../../models/interfaces/notification';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  public readonly DEFAULT_DURATION = 4000;
  public get notificationsChanged() {
    return this.notifications$.asObservable();
  }
  private notifications$ = new BehaviorSubject<Notification[]>([]);

  public addNotification(notification: Notification) {
    if (!notification.createdAt) {
      notification.createdAt = new Date();
    }

    this.notifications$.next([...this.notifications$.value, notification]);

    setTimeout(
      () =>
        this.notifications$.next(
          this.notifications$.value.filter((n) => n.createdAt.getTime() !== notification.createdAt.getTime())
        ),
      notification.duration || this.DEFAULT_DURATION
    );
  }
}
