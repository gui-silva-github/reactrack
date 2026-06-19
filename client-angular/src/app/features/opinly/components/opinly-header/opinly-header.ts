import { Component } from '@angular/core';
import { PT } from '../../../../core/constants/i18n-pt';

@Component({
  selector: 'app-opinly-header',
  imports: [],
  templateUrl: './opinly-header.html',
  styleUrl: './opinly-header.css',
})
export class OpinlyHeader {
  readonly t = PT.opinly;
}
