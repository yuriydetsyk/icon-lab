import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ClipboardService } from 'ngx-clipboard';

import { Color } from '../../../models/enums/color';

@Component({
  selector: 'bd-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ColorPickerComponent,
      multi: true,
    },
  ],
})
export class ColorPickerComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() public active = false;
  @Input() public hover = false;
  @Input() public savedColors: string[] = [];
  @Output() public addToSaved = new EventEmitter<string>();
  @Output() public removeFromSaved = new EventEmitter<string>();
  @Output() public savedColorsChanged = new EventEmitter<string[]>();
  @ViewChild(ColorPickerComponent) public colorPicker: ColorPickerComponent;
  @ViewChild('wrapper', { static: true }) public wrapper: ElementRef<HTMLDivElement>;
  public value: string;
  public colorPickerOpened = false;
  public fallbackColor = Color.White;
  public get isSaved() {
    return this.savedColors.includes(this.value);
  }
  public get saveButtonClass() {
    return this.isSaved ? 'icon-star-filled tool-save-visible' : 'icon-star';
  }

  private hexColorRegex = /^#[0-9A-F]{6}$/i;
  private listenerFn: () => void;

  constructor(private readonly renderer: Renderer2, private readonly clipboardService: ClipboardService) {}

  public onChange = (_: string) => {};
  public onTouch = () => {};

  public ngOnInit() {
    this.listenerFn = this.renderer.listen('window', 'click', (e: Event) => {
      if (!e.composedPath().includes(this.wrapper.nativeElement)) {
        this.active = false;
      }
    });
  }

  public ngOnDestroy() {
    this.listenerFn();
  }

  public writeValue(value: string) {
    this.value = value;
  }

  public registerOnChange(fn: any) {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any) {
    this.onTouch = fn;
  }

  public getFormattedColor(color: string, removeHash = true) {
    if (!color) {
      return color;
    }

    const formatted = color.toUpperCase();
    return removeHash ? formatted.replace('#', '') : formatted;
  }

  public setColor(value: string) {
    if (value.charAt(0) !== '#') {
      value = `#${value}`;
    }

    if (this.hexColorRegex.test(value)) {
      this.value = this.getFormattedColor(value, false);
      this.onChange(this.value);
    }
  }

  public toggleColorPicker(isOpened?: boolean) {
    if (isOpened == null) {
      this.colorPickerOpened = !this.colorPickerOpened;
    } else {
      this.colorPickerOpened = isOpened;
    }

    // TODO: find a better solution to handle color picker template
    setTimeout(() => {
      if (this.colorPickerOpened) {
        const colorPickerEl = this.wrapper.nativeElement.querySelector('.color-picker.open');
        const presetAreaEl = colorPickerEl.querySelector('.preset-area');

        // disable existing color picker edit mode, if needed
        this.renderer.removeClass(colorPickerEl, 'edit-mode');

        // remove existing edit icon
        const oldEditButtonEl = colorPickerEl.querySelector('.icon-pencil');
        if (oldEditButtonEl) {
          this.renderer.removeChild(presetAreaEl, oldEditButtonEl);
        }

        // initialize edit icon and its handlers
        const hexInputEl = colorPickerEl.querySelector('.hex-text input');
        this.renderer.setAttribute(hexInputEl, 'tabindex', '-1');

        const editButtonEl = this.renderer.createElement('button');
        this.renderer.setAttribute(editButtonEl, 'title', 'Toggle edit mode');
        editButtonEl.classList.add('icon', 'icon-pencil', 'toggle-edit-mode');
        this.renderer.listen(editButtonEl, 'click', () => {
          if (colorPickerEl.classList.contains('edit-mode')) {
            this.renderer.removeClass(colorPickerEl, 'edit-mode');
          } else {
            this.renderer.addClass(colorPickerEl, 'edit-mode');
          }
        });

        this.renderer.insertBefore(presetAreaEl, editButtonEl, presetAreaEl.firstChild);
      }
    });
  }

  public onPickerOpen() {
    this.active = true;
  }

  public onPickerClose() {
    this.active = false;
  }

  public copy() {
    this.clipboardService.copy(this.getFormattedColor(this.value, false));
    console.log('Successfully copied the color value!'); // TODO: add snackbar notifications
  }

  public processSavedState() {
    if (this.isSaved) {
      this.removeFromSaved.emit(this.value);
    } else {
      this.addToSaved.emit(this.value);
    }
  }

  public changeSavedColors(colors: string[]) {
    this.savedColorsChanged.emit(colors);
  }
}
