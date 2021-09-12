import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

import { IconStyle } from '../../models/interfaces/icon-style';

@Injectable({
  providedIn: 'root',
})
export class IconStyleService {
  public get styleChanged() {
    return this.style$.asObservable();
  }

  private style$ = new BehaviorSubject<IconStyle>(null);

  public setStyle(style: IconStyle) {
    if (this.isActive(style)) {
      // the style is already active - do nothing
      return;
    }

    this.style$.next(style);
  }

  public isActive(style: IconStyle) {
    return this.style$.value?.id === style.id;
  }
}
