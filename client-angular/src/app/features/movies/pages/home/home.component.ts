import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MoviesService, IMovie } from '../../../../core/services/movies/movies.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-movies-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="movies-page">
      <header class="navbar">
        <h1>🎬 Filmes</h1>
        <a routerLink="/systems/movies/search" class="search-link">Buscar filme</a>
      </header>

      <h2 class="title">Top Filmes</h2>

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
    .movies-page {
      min-height: 100vh;
      background: #111;
      color: #fff;
      padding: 5rem 1rem 2rem;
    }
    .navbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
      padding: 0.8rem 1rem;
      background: #121212;
      border-radius: 8px;
    }
    .search-link {
      background: #f7d354;
      color: #000;
      text-decoration: none;
      padding: 0.45rem 0.8rem;
      border-radius: 4px;
      font-weight: 700;
    }
    .title {
      margin: 1.2rem 0 0.7rem;
      text-align: center;
    }
    .loading {
      text-align: center;
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
export class MoviesHomeComponent {
  movies = signal<IMovie[]>([]);
  loading = signal(false);
  readonly fallbackPoster = 'https://i.pinimg.com/originals/ff/11/78/ff1178bf89cb845635f083aa57429c6f.jpg';

  constructor(
    public moviesService: MoviesService,
    private toastService: ToastService
  ) {
    this.loadPopularMovies();
  }

  loadPopularMovies(): void {
    this.loading.set(true);
    this.moviesService.getPopularMovies().subscribe({
      next: (data) => {
        this.movies.set(data.results);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toastService.error('Erro ao carregar filmes.');
      }
    });
  }
}










