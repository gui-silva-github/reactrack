import { Component, inject } from '@angular/core';
import { ErrorBlock } from "../error-block/error-block";
import { FormsModule } from '@angular/forms';
import { EventItem } from '../event-item/event-item';
import { LoadingIndicator } from '../loading-indicator/loading-indicator';
import { ConveneService } from '../../../../core/services/convene/convene.service';
import { PT } from '../../../../core/constants/i18n-pt';
import { IConveneEventPayload } from '../../../../core/models';

@Component({
  selector: 'app-find-event',
  imports: [FormsModule, EventItem, LoadingIndicator, ErrorBlock],
  templateUrl: './find-event.html',
  styleUrl: './find-event.css',
})
export class FindEvent {
  private readonly conveneService = inject(ConveneService);
  readonly t = PT.convene;
  searchTerm = '';
  submitted = false;
  loading = false;
  error = false;
  results: IConveneEventPayload[] = [];

  search(): void {
    this.submitted = true;
    this.loading = true;
    this.error = false;
    this.conveneService.getEvents({ searchTerm: this.searchTerm }).subscribe({
      next: (data) => {
        this.results = data;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    })
  }
}
