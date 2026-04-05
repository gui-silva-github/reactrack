import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MoviesService, IMovie } from '../../../../core/services/movies/movies.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="movie-page">
      <a routerLink="/systems/movies" class="back">← Voltar</a>
      @if (loading()) {
        <p>Carregando...</p>
      } @else if (movie()) {
        <article class="movie-card">
          <img
            [src]="movie()!.poster_path ? moviesService.imgApi + movie()!.poster_path : fallbackPoster"
            [alt]="movie()!.title"
          />
          <h1>{{ movie()!.title }}</h1>
          <p class="tagline">{{ movie()!.tagline || 'Sem tagline' }}</p>
          <div class="info"><strong>⭐ Nota:</strong> {{ movie()!.vote_average.toFixed(1) }}</div>
          <div class="info"><strong>Orçamento:</strong> {{ formatCurrency(movie()!.budget || 0) }}</div>
          <div class="info"><strong>Receita:</strong> {{ formatCurrency(movie()!.revenue || 0) }}</div>
          <div class="info"><strong>Duração:</strong> {{ movie()!.runtime || 0 }} minutos</div>
          <div class="info"><strong>Lançamento:</strong> {{ movie()!.release_date }}</div>
          <div class="info description">
            <strong>Descrição:</strong>
            <p>{{ movie()!.overview || 'Sem descrição.' }}</p>
          </div>
        </article>
      } @else {
        <p>Filme não encontrado.</p>
      }
    </section>
  `,
  styles: [`
    .movie-page {
      padding: 5rem 1rem 2rem;
      max-width: 760px;
      margin: 0 auto;
      color: #111;
    }
    .back {
      color: #2563eb;
      text-decoration: none;
      display: inline-block;
      margin-bottom: 1rem;
    }
    .movie-card img {
      width: 100%;
      height: 420px;
      object-fit: cover;
      border-radius: 10px;
      margin-bottom: 1rem;
    }
    .tagline {
      text-align: center;
      color: #4b5563;
      margin-bottom: 1rem;
    }
    .info {
      margin-bottom: 0.7rem;
    }
    .description p {
      margin-top: 0.4rem;
      line-height: 1.4rem;
    }
  `]
})
export class MovieComponent {
  movie = signal<IMovie | null>(null);
  loading = signal(false);
  readonly fallbackPoster = 'https://i.pinimg.com/originals/ff/11/78/ff1178bf89cb845635f083aa57429c6f.jpg';

  constructor(
    private route: ActivatedRoute,
    public moviesService: MoviesService,
    private toastService: ToastService
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadMovie(+id);
    }
  }

  loadMovie(id: number): void {
    this.loading.set(true);
    this.moviesService.getMovie(id).subscribe({
      next: (data) => {
        this.movie.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toastService.error('Erro ao carregar filme.');
      }
    });
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }
}










