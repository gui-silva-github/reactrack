import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CONVENE_URL } from '../../../../core/constants/api-urls';
import { ConveneI18n } from '../../convene-i18n';
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
  readonly t = inject(ConveneI18n);
  readonly imagesEndpoint = `${CONVENE_URL}/`;

  formatDate(date: string): string {
    return addDay(date);
  }
}
