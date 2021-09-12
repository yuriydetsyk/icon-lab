import { Component, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'bd-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SearchInputComponent,
      multi: true,
    },
  ],
})
export class SearchInputComponent implements ControlValueAccessor {
  @Input() public placeholder: string;
  @Input() public hover = false;
  @Input() public active = false;

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

  public onModelChange(value: string) {
    this.value = value;
    this.onChange(this.value);
  }

  public clearSearch() {
    this.value = null;
    this.onChange(this.value);
  }
}
