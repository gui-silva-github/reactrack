import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet, RouterLink } from '@angular/router';
import { ConveneService, IConveneEvent } from '../../../../core/services/convene/convene.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink],
  template: `
    <section class="events-page">
      <router-outlet />

      <header class="header">
        <h1>Convene - Eventos</h1>
        <a routerLink="/systems/convene/events/new" class="button">Novo Evento</a>
      </header>

      <section class="filters">
        <input
          type="text"
          name="query"
          [(ngModel)]="query"
          placeholder="Buscar por título ou local"
        />
      </section>

      @if (loading()) {
        <p>Carregando eventos...</p>
      } @else {
        <div class="events-grid">
          @for (event of filteredEvents(); track event.id) {
            <article class="event-card">
              @if (event.image) {
                <img [src]="event.image.startsWith('http') ? event.image : conveneService.imagesEndpoint + event.image" [alt]="event.title" />
              }
              <h3>{{ event.title }}</h3>
              <p>{{ event.location }}</p>
              <p>{{ event.date }}</p>
              <div class="actions">
                <a [routerLink]="['/systems/convene/events', event.id]">Detalhes</a>
                <button type="button" class="danger" (click)="remove(event)">Excluir</button>
              </div>
            </article>
          }
        </div>
      }
    </section>
  `,
  styles: [`
    .events-page {
      max-width: 1100px;
      margin: 0 auto;
      padding: 5.2rem 1rem 2rem;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .button {
      text-decoration: none;
      background: #2563eb;
      color: #fff;
      border-radius: 8px;
      padding: 0.5rem 0.9rem;
      font-weight: 700;
    }
    .filters input {
      width: 100%;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      padding: 0.6rem;
      margin-bottom: 1rem;
    }
    .events-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 0.8rem;
    }
    .event-card {
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      background: #fff;
      padding: 0.8rem;
      display: grid;
      gap: 0.4rem;
    }
    .event-card img {
      width: 100%;
      height: 150px;
      object-fit: cover;
      border-radius: 8px;
    }
    .actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 0.4rem;
    }
    .actions a {
      text-decoration: none;
      color: #1d4ed8;
      font-weight: 600;
    }
    .danger {
      border: none;
      border-radius: 8px;
      padding: 0.4rem 0.7rem;
      color: #fff;
      background: #dc2626;
      cursor: pointer;
    }
  `]
})
export class EventsComponent {
  events = signal<IConveneEvent[]>([]);
  loading = signal(false);
  query = '';

  constructor(
    public conveneService: ConveneService,
    private toastService: ToastService
  ) {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading.set(true);
    this.conveneService.getEvents().subscribe({
      next: (data) => {
        this.events.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toastService.error('Erro ao carregar eventos.');
      }
    });
  }

  filteredEvents(): IConveneEvent[] {
    const query = this.query.trim().toLowerCase();
    if (!query) return this.events();
    return this.events().filter((event) =>
      event.title.toLowerCase().includes(query) ||
      event.location.toLowerCase().includes(query)
    );
  }

  remove(event: IConveneEvent): void {
    if (!event.id) return;
    this.conveneService.deleteEvent(event.id).subscribe({
      next: () => {
        this.toastService.success('Evento removido.');
        this.loadEvents();
      },
      error: () => this.toastService.error('Falha ao remover evento.')
    });
  }
}










