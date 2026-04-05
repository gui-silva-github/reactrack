import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OpinlyService, IOpinion } from '../../../../core/services/opinly/opinly.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-opinly',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="opinly-page">
      <header class="header">
        <h1>Opinly</h1>
        <p>Publique e vote em opiniões.</p>
      </header>

      <form class="new-opinion" (ngSubmit)="submitOpinion()">
        <input
          type="text"
          name="author"
          [(ngModel)]="author"
          placeholder="Seu nome"
          required
        />
        <textarea
          name="text"
          [(ngModel)]="text"
          placeholder="Escreva sua opinião..."
          required
        ></textarea>
        <button type="submit" [disabled]="loading()">Publicar</button>
      </form>

      @if (loading()) {
        <p>Carregando opiniões...</p>
      } @else {
        <div class="opinions-list">
          @for (opinion of opinions(); track opinion.id) {
            <article class="opinion-card">
              <p class="opinion-text">{{ opinion.text }}</p>
              <div class="meta">
                <span>Por {{ opinion.author }}</span>
                <div class="votes">
                  <button type="button" (click)="vote(opinion, 'up')">👍 {{ opinion.upvotes }}</button>
                  <button type="button" (click)="vote(opinion, 'down')">👎 {{ opinion.downvotes }}</button>
                </div>
              </div>
            </article>
          }
        </div>
      }
    </section>
  `,
  styles: [`
    .opinly-page {
      max-width: 50rem;
      margin: 3rem auto;
      padding: 2rem;
      border-left: 1px solid #353331;
      border-right: 1px solid #353331;
    }
    .header h1 {
      margin: 0 0 0.3rem;
    }
    .new-opinion {
      margin: 1rem 0;
      display: grid;
      gap: 0.6rem;
    }
    input, textarea {
      width: 100%;
      padding: 0.65rem;
      border-radius: 8px;
      border: 1px solid #d1d5db;
    }
    textarea {
      min-height: 90px;
      resize: vertical;
    }
    button {
      border: none;
      background: #1d4ed8;
      color: white;
      border-radius: 8px;
      padding: 0.55rem 0.8rem;
      cursor: pointer;
    }
    .opinions-list {
      display: grid;
      gap: 0.8rem;
    }
    .opinion-card {
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      padding: 0.8rem;
      background: #fff;
    }
    .opinion-text {
      margin: 0 0 0.7rem;
    }
    .meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.8rem;
      color: #6b7280;
      font-size: 0.9rem;
    }
    .votes {
      display: flex;
      gap: 0.4rem;
    }
    .votes button {
      background: #f3f4f6;
      color: #111827;
    }
  `]
})
export class OpinlyComponent {
  opinions = signal<IOpinion[]>([]);
  loading = signal(false);
  author = '';
  text = '';

  constructor(
    private opinlyService: OpinlyService,
    private toastService: ToastService
  ) {
    this.loadOpinions();
  }

  loadOpinions(): void {
    this.loading.set(true);
    this.opinlyService.loadOpinions().subscribe({
      next: (data) => {
        this.opinions.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toastService.error('Erro ao carregar opiniões.');
      }
    });
  }

  submitOpinion(): void {
    if (!this.author.trim() || !this.text.trim()) return;

    const payload: IOpinion = {
      author: this.author.trim(),
      text: this.text.trim(),
      upvotes: 0,
      downvotes: 0
    };

    this.loading.set(true);
    this.opinlyService.saveOpinion(payload).subscribe({
      next: () => {
        this.author = '';
        this.text = '';
        this.loadOpinions();
      },
      error: () => {
        this.loading.set(false);
        this.toastService.error('Erro ao salvar opinião.');
      }
    });
  }

  vote(opinion: IOpinion, type: 'up' | 'down'): void {
    if (!opinion.id) return;
    const request = type === 'up'
      ? this.opinlyService.upvoteOpinion(opinion.id)
      : this.opinlyService.downvoteOpinion(opinion.id);

    request.subscribe({
      next: () => this.loadOpinions(),
      error: () => this.toastService.warning('Não foi possível registrar seu voto.')
    });
  }
}










