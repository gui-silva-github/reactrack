import { Component, inject, ViewEncapsulation } from '@angular/core';
import { ErrorBlock } from "../error-block/error-block";
import { FormsModule } from '@angular/forms';
import { EventItem } from '../event-item/event-item';
import { LoadingIndicator } from '../loading-indicator/loading-indicator';
import { ConveneService } from '../../../../core/services/convene/convene.service';
import { ConveneI18n } from '../../convene-i18n';
import { IConveneEventPayload } from '../../../../core/models';

@Component({
  selector: 'app-find-event',
  imports: [FormsModule, EventItem, LoadingIndicator, ErrorBlock],
  templateUrl: './find-event.html',
  styleUrl: './find-event.css',
  encapsulation: ViewEncapsulation.None,
})
export class FindEvent {
  private readonly conveneService = inject(ConveneService);
  readonly t = inject(ConveneI18n);
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
