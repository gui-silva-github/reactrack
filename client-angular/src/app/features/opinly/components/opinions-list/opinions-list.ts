import { Component, inject } from '@angular/core';
import { I18nService } from '../../../../core/services/i18n/i18n.service';
import { OpinlyStateService } from '../../../../core/services/state/opinly-state.service';
import { OpinionCard } from '../opinion-card/opinion-card';

@Component({
  selector: 'app-opinions-list',
  imports: [OpinionCard],
  templateUrl: './opinions-list.html',
  styleUrl: './opinions-list.css',
})
export class OpinionsList {
  readonly opinlyState = inject(OpinlyStateService);
  readonly i18n = inject(I18nService);
}
