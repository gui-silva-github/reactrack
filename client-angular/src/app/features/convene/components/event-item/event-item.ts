import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CONVENE_URL } from '../../../../core/constants/api-urls';
import { PT } from '../../../../core/constants/i18n-pt';
import { IConveneEventPayload } from '../../../../core/models';
import { addDay } from '../../../../core/utils/convene.util';

@Component({
  selector: 'app-event-item',
  imports: [RouterLink],
  templateUrl: './event-item.html',
  styleUrl: './event-item.css',
})
export class EventItem {
  readonly event = input.required<IConveneEventPayload>();
  readonly t = PT.convene;
  readonly imagesEndpoint = `${CONVENE_URL}/`;

  formatDate(date: string): string {
    return addDay(date);
  }
}
