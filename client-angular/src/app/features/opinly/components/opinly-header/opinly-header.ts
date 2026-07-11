import { Component, inject } from '@angular/core';
import { I18nService } from '../../../../core/services/i18n/i18n.service';

@Component({
  selector: 'app-opinly-header',
  imports: [],
  templateUrl: './opinly-header.html',
  styleUrl: './opinly-header.css',
})
export class OpinlyHeader {
  readonly i18n = inject(I18nService);
}
