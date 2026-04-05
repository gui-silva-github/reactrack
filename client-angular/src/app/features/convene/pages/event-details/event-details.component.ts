import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { ConveneService, IConveneEvent } from '../../../../core/services/convene/convene.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  template: `
    <section class="details-page">
      <router-outlet />

      <a routerLink="/systems/convene/events" class="back-link">← Ver todos eventos</a>

      @if (loading()) {
        <p>Carregando dados de evento...</p>
      } @else if (event()) {
        <article class="details-card">
          <header>
            <h1>{{ event()!.title }}</h1>
            <div class="actions">
              <a [routerLink]="['/systems/convene/events', event()!.id, 'edit']">Editar</a>
              <button type="button" (click)="removeEvent()">Excluir</button>
            </div>
          </header>

          @if (event()!.image) {
            <img [src]="event()!.image!.startsWith('http') ? event()!.image : conveneService.imagesEndpoint + event()!.image" [alt]="event()!.title" />
          }

          <p><strong>Local:</strong> {{ event()!.location }}</p>
          <p><strong>Data:</strong> {{ event()!.date }}</p>
          <p class="description">{{ event()!.description }}</p>
        </article>
      } @else {
        <p>Evento não encontrado.</p>
      }
    </section>
  `,
  styles: [`
    .details-page {
      max-width: 900px;
      margin: 0 auto;
      padding: 5.2rem 1rem 2rem;
    }
    .back-link {
      color: #2563eb;
      text-decoration: none;
      display: inline-block;
      margin-bottom: 1rem;
    }
    .details-card {
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      background: #fff;
      padding: 1rem;
    }
    header {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      align-items: center;
      margin-bottom: 0.8rem;
    }
    .actions {
      display: flex;
      gap: 0.4rem;
    }
    .actions a, .actions button {
      border: none;
      border-radius: 8px;
      padding: 0.45rem 0.7rem;
      text-decoration: none;
      cursor: pointer;
      font-weight: 600;
    }
    .actions a {
      background: #1d4ed8;
      color: #fff;
    }
    .actions button {
      background: #dc2626;
      color: #fff;
    }
    img {
      width: 100%;
      max-height: 380px;
      object-fit: cover;
      border-radius: 10px;
      margin-bottom: 0.8rem;
    }
    .description {
      line-height: 1.5rem;
    }
  `]
})
export class EventDetailsComponent {
  event = signal<IConveneEvent | null>(null);
  loading = signal(false);

  constructor(
    private route: ActivatedRoute,
    public conveneService: ConveneService,
    private toastService: ToastService
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadEvent(id);
    }
  }

  loadEvent(id: string): void {
    this.loading.set(true);
    this.conveneService.getEvent(id).subscribe({
      next: (data) => {
        this.event.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toastService.error('Erro ao carregar evento.');
      }
    });
  }

  removeEvent(): void {
    const event = this.event();
    if (!event?.id) return;
    this.conveneService.deleteEvent(event.id).subscribe({
      next: () => {
        this.toastService.success('Evento removido.');
        this.event.set(null);
      },
      error: () => this.toastService.error('Falha ao remover evento.')
    });
  }
}










