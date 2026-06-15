import { Component, ElementRef, input, output, viewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal implements AfterViewInit {
  readonly open = input(true);
  readonly closed = output<void>();
  private readonly dialog = viewChild<ElementRef<HTMLDialogElement>>('dialog');

  ngAfterViewInit(): void {
    if (this.open()) {
      this.dialog()?.nativeElement.showModal();
    }
  }
}
