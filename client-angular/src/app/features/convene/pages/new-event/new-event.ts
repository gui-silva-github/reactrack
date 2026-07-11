import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ConveneI18n } from '../../convene-i18n';
import { EventForm } from "../../components/event-form/event-form";
import { IConveneEventPayload } from '../../../../core/models';
import { ConveneService } from '../../../../core/services/convene/convene.service';
import { ErrorBlock } from '../../components/error-block/error-block';
import { Modal } from '../../components/modal/modal';

@Component({
  selector: 'app-new-event',
  imports: [
    Modal, EventForm, RouterLink, ErrorBlock
  ],
  templateUrl: './new-event.html',
  styleUrl: './new-event.css',
})
export class NewEvent {
  private readonly conveneService = inject(ConveneService);
  private readonly router = inject(Router);
  readonly t = inject(ConveneI18n);
  saving = false;
  error = false;

  create(event: IConveneEventPayload): void {
    this.saving = true;
    this.conveneService.createEvent(event).subscribe({
      next: () => this.router.navigate(['/systems/convene/events']),
      error: () => {
        this.error = true;
        this.saving = false;
      }
    })
  }

  close(): void {
    this.router.navigate(['/systems/convene/events']);
  }
}
