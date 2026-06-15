import { Component, inject, OnInit } from '@angular/core';
import { PT } from '../../../../core/constants/i18n-pt';
import { ConveneService } from '../../../../core/services/convene/convene.service';
import { ErrorBlock } from '../error-block/error-block';
import { LoadingIndicator } from '../loading-indicator/loading-indicator';
import { EventItem } from '../event-item/event-item';
import { IConveneEventPayload } from '../../../../core/models';

@Component({
  selector: 'app-new-events',
  imports: [EventItem, LoadingIndicator, ErrorBlock],
  templateUrl: './new-events.html',
  styleUrl: './new-events.css',
})
export class NewEvents implements OnInit {
  private readonly conveneService = inject(ConveneService);
  readonly t = PT.convene;
  events: IConveneEventPayload[] = [];
  loading = true;
  error = false;

  ngOnInit(): void {
    this.conveneService.getEvents({ max: 3 }).subscribe({
      next: (data) => {
        this.events = data;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    })
  }
}
