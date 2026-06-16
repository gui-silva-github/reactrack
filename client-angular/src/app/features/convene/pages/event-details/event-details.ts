import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { CONVENE_URL } from '../../../../core/constants/api-urls';
import { PT } from '../../../../core/constants/i18n-pt';
import { IConveneEventPayload } from '../../../../core/models';
import { ConveneService } from '../../../../core/services/convene/convene.service';
import { addDay } from '../../../../core/utils/convene.util';
import { ErrorBlock } from '../../components/error-block/error-block';
import { Header } from '../../components/header/header';
import { Modal } from '../../components/modal/modal';

@Component({
  selector: 'app-event-details',
  imports: [
    RouterOutlet, RouterLink, Header, Modal, ErrorBlock
  ],
  templateUrl: './event-details.html',
  styleUrl: './event-details.css',
})
export class EventDetails {
  private readonly route = inject(ActivatedRoute)
  private readonly router = inject(Router)
  private readonly conveneService = inject(ConveneService);
  readonly t = PT.convene;
  readonly imagesEndpoint = `${CONVENE_URL}/`;

  event: IConveneEventPayload | null = null;
  loading = true;
  error = false;
  showDeleteModal = false;
  deleting = false;
  deleteError = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
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

  formatDate(date: string): string {
    return addDay(date);
  }

  deleteEvent(): void {
    if (!this.event?.id) return;
    this.deleting = true;
    this.conveneService.deleteEvent(this.event.id).subscribe({
      next: () => this.router.navigate(['/systems/convene/events']),
      error: () => {
        this.deleteError = true;
        this.deleting = false;
      }
    });
  }
}
