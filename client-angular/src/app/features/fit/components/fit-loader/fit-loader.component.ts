import { Component } from '@angular/core';

@Component({
  selector: 'app-fit-loader',
  standalone: true,
  template: `
    <div class="fit-loader" role="status" aria-live="polite">
      <div class="fit-loader-spin"></div>
    </div>
  `,
  styleUrl: './fit-loader.component.css',
})
export class FitLoaderComponent {}
