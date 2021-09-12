import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { TabId } from '../../../models/enums/tab-id';
import { NavTab } from '../../../models/interfaces/nav-tab';

@Component({
  selector: 'bd-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements OnChanges {
  @Input() public tabs: NavTab[];
  @Input() public snap: 'top' | 'bottom' = 'top';
  @Output() public tabChange = new EventEmitter<TabId>();

  private activeTab: NavTab;

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.tabs) {
      const activeTab = (changes.tabs.currentValue as NavTab[]).find((tab) => tab.active);
      this.process(activeTab?.id);
    }
  }

  public process(tabId: TabId) {
    if (this.activeTab?.id !== tabId) {
      this.setActive(tabId);
    }
  }

  private setActive(tabId: TabId) {
    this.tabs.forEach((tab) => {
      if (tab.id !== tabId) {
        tab.active = false;
      } else {
        tab.active = true;
        this.activeTab = tab;
      }
    });

    this.tabChange.emit(tabId);
  }
}
