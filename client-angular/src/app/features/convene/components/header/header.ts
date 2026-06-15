import { Component } from '@angular/core';
import { PT } from '../../../../core/constants/i18n-pt';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  readonly t = PT.convene;
}
