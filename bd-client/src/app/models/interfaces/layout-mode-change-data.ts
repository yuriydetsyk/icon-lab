import { LayoutMode } from '../enums/layout-mode';

export interface LayoutModeChangeData {
  mode: LayoutMode;
  oldMode?: LayoutMode;
}
