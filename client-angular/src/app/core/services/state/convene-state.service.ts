import { Injectable, inject, signal } from "@angular/core";
import { finalize } from "rxjs";
import { IConveneEventPayload } from "../../models";
import { ConveneImage } from "../../models";
import { ConveneService } from "../convene/convene.service";

@Injectable({ providedIn: 'root' })
export class ConveneStateService {
  private readonly conveneService = inject(ConveneService);

  private readonly eventsSignal = signal<IConveneEventPayload[]>([]);
  private readonly selectedEventSignal = signal<IConveneEventPayload | null>(null);
  private readonly imagesSignal = signal<ConveneImage[]>([]);
  private readonly loadingSignal = signal(false);

  readonly events = this.eventsSignal.asReadonly();
  readonly selectedEvent = this.selectedEventSignal.asReadonly();
  readonly images = this.imagesSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();

  loadEvents(): void {
    this.loadingSignal.set(true);
    this.conveneService
      .getEvents()
      .pipe(finalize(() => this.loadingSignal.set(false)))
      .subscribe({
        next: (events) => this.eventsSignal.set(events),
        error: () => this.eventsSignal.set([]),
      });
  }

  loadEvent(id: string): void {
    this.loadingSignal.set(true);
    this.conveneService
      .getEvent(id)
      .pipe(finalize(() => this.loadingSignal.set(false)))
      .subscribe({
        next: (event) => this.selectedEventSignal.set(event),
        error: () => this.selectedEventSignal.set(null),
      });
  }

  loadImages(): void {
    this.conveneService.getImages().subscribe({
      next: (images) => this.imagesSignal.set(images),
      error: () => this.imagesSignal.set([]),
    });
  }

  createEvent(event: IConveneEventPayload): void {
    this.conveneService.createEvent(event).subscribe({
      next: (created) => this.eventsSignal.update((prev) => [created, ...prev]),
    });
  }

  updateEvent(id: string, event: IConveneEventPayload): void {
    this.conveneService.updateEvent(id, event).subscribe({
      next: (updated) => {
        this.selectedEventSignal.set(updated);
        this.eventsSignal.update((prev) =>
          prev.map((item) => (item.id === id ? updated : item))
        );
      }
    });
  }

  deleteEvent(id: string): void {
    this.conveneService.deleteEvent(id).subscribe({
      next: () => {
        this.selectedEventSignal.set(null);
        this.eventsSignal.update((prev) => prev.filter((item) => item.id !== id));
      }
    });
  }
}
