import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';

@Component({
  selector: 'bd-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input() public modalTitle = '';
  @Output() public closed = new EventEmitter<void>();
  @Output() public saved = new EventEmitter<void>();
  private listenerFn: () => void;

  constructor(private readonly renderer: Renderer2) {}

  public ngOnInit() {
    this.listenerFn = this.renderer.listen('document', 'keyup.esc', (e: Event) => this.closeModal(e));
  }

  public ngOnDestroy() {
    this.listenerFn();
  }

  public closeModal(e: Event) {
    e.stopPropagation();
    this.closed.emit();
  }

  public saveModal(e?: Event) {
    if (e) {
      e.stopPropagation();
    }
    this.saved.emit();
  }
}
