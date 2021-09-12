import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, HostBinding, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { LabService } from '../../../core/services/lab.service';

import { LayoutService } from '../../../core/services/layout.service';
import { IconPosition } from '../../../models/enums/icon-position';
import { TabId } from '../../../models/enums/tab-id';
import { NavTab } from '../../../models/interfaces/nav-tab';

@Component({
  selector: 'bd-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.scss'],
})
export class RightSidebarComponent implements OnInit, OnDestroy {
  @HostBinding('class.right-sidebar') private hostClass = true;

  public labTabs: NavTab[] = [
    {
      id: TabId.Icons,
      title: 'Icons',
      active: true,
    },
    {
      id: TabId.Avatars,
      title: 'Avatars',
    },
  ];
  public activeTabId: TabId;
  public TabId = TabId;
  public hasIconPosition$ = this.labService.hasIconPosition$;
  public hasBackgroundPosition$ = this.labService.hasBackgroundPosition$;
  private isLargeScreen = this.breakpointObserver.isMatched(this.layoutSevice.MEDIA_QUERIES.largeScreen);
  private destroyed$ = new Subject<void>();
  private listenerFn: () => void;

  constructor(
    private readonly breakpointObserver: BreakpointObserver,
    private readonly renderer: Renderer2,
    private readonly layoutSevice: LayoutService,
    private readonly labService: LabService
  ) {}

  public ngOnInit() {
    this.listenerFn = this.renderer.listen('window', 'click', (e: Event) => {
      if (
        !this.isLargeScreen &&
        !e.composedPath().some((el) => (el as Element)?.classList?.contains('right-sidebar'))
      ) {
        this.layoutSevice.toggleRightSidebar(false);
      }
    });

    this.breakpointObserver
      .observe(this.layoutSevice.MEDIA_QUERIES.largeScreen)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((state) => {
        this.isLargeScreen = state.matches;
        this.layoutSevice.toggleRightSidebar(this.isLargeScreen);
      });
  }

  public ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.listenerFn();
  }

  public onTabChange(tabId: TabId) {
    this.activeTabId = tabId;
  }

  public toggleRightSidebar(state: boolean) {
    this.layoutSevice.toggleRightSidebar(state);
  }
}
