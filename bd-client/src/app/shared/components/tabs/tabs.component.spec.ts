import { NO_ERRORS_SCHEMA, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabId } from '../../../models/enums/tab-id';
import { NavTab } from '../../../models/interfaces/nav-tab';

import { TabsComponent } from './tabs.component';

describe('TabsComponent', () => {
  let component: TabsComponent;
  let fixture: ComponentFixture<TabsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [TabsComponent],
    });
    fixture = TestBed.createComponent(TabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    it('makes expected calls', () => {
      const simpleChangesStub: SimpleChanges = { tabs: { currentValue: [] } } as any;
      jest.spyOn(component, 'process');
      component.ngOnChanges(simpleChangesStub);
      expect(component.process).toHaveBeenCalled();
    });
  });

  describe('process', () => {
    it('should process active tab', () => {
      const selectedTabId = TabId.Avatars;
      component.tabs = [{ id: selectedTabId }, { id: TabId.Icons }] as NavTab[];

      component.process(selectedTabId);

      expect(component.tabs.find((tab) => tab.id === selectedTabId).active).toBeTruthy();
      expect(component.tabs.find((tab) => tab.id !== selectedTabId).active).toBeFalsy();
    });

    it('should not process active tab, if it has not been changed', () => {
      const tabChangeSpy = jest.spyOn(component.tabChange, 'emit');
      const selectedTabId = TabId.Avatars;
      component.tabs = [{ id: selectedTabId }, { id: TabId.Icons }] as NavTab[];

      component.process(selectedTabId);

      expect(tabChangeSpy).toHaveBeenCalledTimes(1);

      component.process(selectedTabId);

      expect(tabChangeSpy).toHaveBeenCalledTimes(1);
    });
  });
});
