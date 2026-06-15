import { Component, input } from '@angular/core';

@Component({
  selector: 'app-error-block',
  imports: [],
  templateUrl: './error-block.html',
  styleUrl: './error-block.css',
})
export class ErrorBlock {
  readonly title = input.required<string>();
  readonly message = input.required<string>();
  readonly errors = input<string[]>();
}
