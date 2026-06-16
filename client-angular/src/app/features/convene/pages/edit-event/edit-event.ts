import { Component, inject, OnInit } from '@angular/core';
import { PT } from '../../../../core/constants/i18n-pt';
import { IConveneEventPayload } from '../../../../core/models';
import { ConveneService } from '../../../../core/services/convene/convene.service';
import { ErrorBlock } from '../../components/error-block/error-block';
import { LoadingIndicator } from '../../components/loading-indicator/loading-indicator';
import { Modal } from "../../components/modal/modal";
import { EventForm } from '../../components/event-form/event-form';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-edit-event',
  imports: [
    Modal, EventForm, RouterLink, ErrorBlock, LoadingIndicator
  ],
  templateUrl: './edit-event.html',
  styleUrl: './edit-event.css',
})
export class EditEvent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly conveneService = inject(ConveneService);
  readonly t = PT.convene;

  event: IConveneEventPayload | null = null;
  loading = true;
  saving = false;
  error = false;

  ngOnInit(): void {
    const id = this.route.parent?.snapshot.paramMap.get('id');
    if (!id) return;
    this.conveneService.getEvent(id).subscribe({
      next: (data) => {
        this.event = data;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    })
  }

  update(payload: IConveneEventPayload): void {
    const id = this.route.parent?.snapshot.paramMap.get('id');
    if (!id) return;
    this.saving = true;
    this.conveneService.updateEvent(id, payload).subscribe({
      next: () => this.router.navigate(['/systems/convene/events', id]),
      error: () => {
        this.error = true;
        this.saving = false;
      }
    })
  }

  close(): void {
    const id = this.route.parent?.snapshot.paramMap.get('id');
    this.router.navigate(['/systems/convene/events', id]);
  }
}
