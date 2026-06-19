import { Component, inject } from '@angular/core';
import { PT } from '../../../../core/constants/i18n-pt';
import { OpinlyStateService } from '../../../../core/services/state/opinly-state.service';
import { OpinionCard } from "../opinion-card/opinion-card";

@Component({
  selector: 'app-opinions-list',
  imports: [OpinionCard],
  templateUrl: './opinions-list.html',
  styleUrl: './opinions-list.css',
})
export class OpinionsList {
  readonly opinlyState = inject(OpinlyStateService);
  readonly t = PT.opinly;
}
