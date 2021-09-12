import { Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DataHelper } from '../../helpers/data.helper';

@Component({
  selector: 'bd-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: DropdownComponent,
      multi: true,
    },
  ],
})
export class DropdownComponent<T extends Record<string, any>> implements OnInit, OnDestroy, ControlValueAccessor {
  @Input() public placeholder: string;
  @Input() public items: T[] = [];
  @Input() public valueProp: any;
  @Input() public labelProp: keyof T = 'label';
  @Input() public cssClass = '';
  @ViewChild('dropdown') public dropdown: ElementRef<HTMLDivElement>;
  public opened = false;
  public value: any;
  public get label() {
    if (this.value && this.items) {
      const selected = this.items.find((item) =>
        this.valueProp ? item[this.valueProp] === this.value : DataHelper.isEqual(item, this.value)
      );
      return selected?.[this.labelProp] || this.placeholder;
    } else {
      return this.placeholder;
    }
  }

  private listenerFn: () => void;

  constructor(private readonly renderer: Renderer2) {}

  public ngOnInit() {
    this.listenerFn = this.renderer.listen('window', 'click', (e: Event) => {
      if (!e.composedPath().includes(this.dropdown.nativeElement)) {
        this.opened = false;
      } else {
        this.opened = !this.opened;
      }
    });
  }

  public ngOnDestroy() {
    this.listenerFn();
  }

  /* START: ControlValueAccessor */
  public onChange = (_: any) => {};
  public onTouch = () => {};

  public writeValue(value: any) {
    this.value = value;
  }

  public registerOnChange(fn: any) {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any) {
    this.onTouch = fn;
  }
  /* END: ControlValueAccessor */

  public onModelChange(item: T) {
    if (!item) {
      this.value = null;
    } else {
      this.value = this.valueProp ? item[this.valueProp] : item;
    }
    this.onChange(this.value);
  }
}
