import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  public readonly MEDIA_QUERIES = {
    largeScreen: '(min-width: 1200px)',
  };
  public get hasOpenedRightSidebar() {
    return this.hasOpenedRightSidebar$.value;
  }
  public get openedRightSidebar() {
    return this.hasOpenedRightSidebar$.asObservable();
  }
  private hasOpenedRightSidebar$ = new BehaviorSubject<boolean>(false);

  public toggleRightSidebar(state: boolean) {
    if (this.hasOpenedRightSidebar === state) {
      return;
    }

    this.hasOpenedRightSidebar$.next(state);
  }
}
