import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'bd-button-group',
  templateUrl: './button-group.component.html',
  styleUrls: ['./button-group.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ButtonGroupComponent,
      multi: true,
    },
  ],
})
export class ButtonGroupComponent implements ControlValueAccessor, OnChanges {
  @Input() public options: Map<string, string>;
  public entries: Array<[string, string]>;

  /* START: ControlValueAccessor */
  public value: string;

  public onChange = (_: string) => {};
  public onTouch = () => {};

  public writeValue(value: string) {
    this.value = value;
  }

  public registerOnChange(fn: any) {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any) {
    this.onTouch = fn;
  }
  /* END: ControlValueAccessor */

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.options) {
      this.entries = changes.options.currentValue
        ? Array.from((changes.options.currentValue as Map<string, string>).entries())
        : [];
    }
  }

  public updateValue(value: string) {
    this.value = value;
    this.onChange(this.value);
  }
}
