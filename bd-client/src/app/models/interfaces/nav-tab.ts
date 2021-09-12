import { TabId } from '../enums/tab-id';

export interface NavTab {
  id: TabId;
  title: string;
  url?: string;
  hover?: boolean;
  active?: boolean;
}
