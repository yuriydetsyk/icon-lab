import { Component, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'bd-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: TextInputComponent,
      multi: true,
    },
  ],
})
export class TextInputComponent implements ControlValueAccessor {
  @Input() public placeholder: string;
  @Input() public hover = false;
  @Input() public active = false;
  @Input() public cssClass = '';
  @Input() public inputId: string;
  @Input() public type = 'text';

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

  public clearText() {
    this.value = null;
    this.onChange(this.value);
  }
}
