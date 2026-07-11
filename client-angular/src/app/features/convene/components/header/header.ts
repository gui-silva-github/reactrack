import { Component, inject } from '@angular/core';
import { ConveneI18n } from '../../convene-i18n';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  readonly t = inject(ConveneI18n);
}
