import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MoviesService, IMovie } from '../../../../core/services/movies/movies.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="search-page">
      <header class="navbar">
        <h1>🎬 Buscar Filmes</h1>
        <a routerLink="/systems/movies">Top filmes</a>
      </header>

      <form class="search-form" (ngSubmit)="search()">
        <input
          type="text"
          name="query"
          [(ngModel)]="query"
          placeholder="Busque um filme"
          required
        />
        <button type="submit" [disabled]="loading()">Procurar</button>
      </form>

      @if (loading()) {
        <p class="loading">Carregando...</p>
      } @else {
        <div class="movies-grid">
          @for (movie of movies(); track movie.id) {
            <article class="movie-card">
              <img
                [src]="movie.poster_path ? moviesService.imgApi + movie.poster_path : fallbackPoster"
                [alt]="movie.title"
              />
              <h3>{{ movie.title }}</h3>
              <p>⭐ {{ movie.vote_average.toFixed(1) }}</p>
              <a [routerLink]="['/systems/movies/movie', movie.id]">Detalhes</a>
            </article>
          }
        </div>
      }
    </section>
  `,
  styles: [`
    .search-page {
      min-height: 100vh;
      background: #111;
      color: #fff;
      padding: 5rem 1rem 2rem;
    }
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      background: #121212;
      padding: 0.8rem 1rem;
      border-radius: 8px;
    }
    .navbar a {
      color: #f7d354;
      text-decoration: none;
      font-weight: 700;
    }
    .search-form {
      max-width: 900px;
      margin: 0 auto 1rem;
      display: flex;
      gap: 0.5rem;
    }
    input {
      flex: 1;
      border-radius: 6px;
      border: none;
      padding: 0.7rem;
    }
    button {
      border: none;
      border-radius: 6px;
      background: #f7d354;
      color: #111;
      font-weight: 700;
      padding: 0.7rem 1rem;
      cursor: pointer;
    }
    .movies-grid {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    }
    .movie-card {
      display: flex;
      flex-direction: column;
      gap: 0.7rem;
      background: #171717;
      padding: 0.9rem;
      border-radius: 8px;
      text-align: center;
    }
    .movie-card img {
      width: 100%;
      height: 300px;
      object-fit: cover;
      border-radius: 6px;
    }
    .movie-card a {
      text-decoration: none;
      background: #f7d354;
      border: 1px solid #f7d354;
      color: #111;
      border-radius: 4px;
      padding: 0.5rem;
      font-weight: 700;
    }
  `]
})
export class SearchComponent {
  movies = signal<IMovie[]>([]);
  query = '';
  loading = signal(false);
  readonly fallbackPoster = 'https://i.pinimg.com/originals/ff/11/78/ff1178bf89cb845635f083aa57429c6f.jpg';

  constructor(
    public moviesService: MoviesService,
    private toastService: ToastService
  ) {}

  search(): void {
    const query = this.query.trim();
    if (!query) return;
    this.loading.set(true);
    this.moviesService.searchMovies(query).subscribe({
      next: (data) => {
        this.movies.set(data.results);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toastService.error('Erro ao buscar filmes.');
      }
    });
  }
}










