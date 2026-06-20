import { Injectable, inject, signal } from "@angular/core";
import { finalize } from "rxjs";
import { IMovieData, ISpecificMovieData } from "../../models";
import { MoviesService } from "../movies/movies.service";

@Injectable({ providedIn: 'root' })
export class MoviesStateService {
  private readonly moviesService = inject(MoviesService);

  private readonly moviesSignal = signal<IMovieData[]>([]);
  private readonly selectedMovieSignal = signal<ISpecificMovieData | null>(null);
  private readonly searchResultsSignal = signal<IMovieData[]>([]);
  private readonly searchQuerySignal = signal('');
  private readonly loadingSignal = signal(false);

  readonly movies = this.moviesSignal.asReadonly();
  readonly selectedMovie = this.selectedMovieSignal.asReadonly();
  readonly searchResults = this.searchResultsSignal.asReadonly();
  readonly searchQuery = this.searchQuerySignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly imgApi = this.moviesService.imgApi;

  loadTopRated(): void {
    this.loadingSignal.set(true);
    this.moviesService
      .getTopRatedMovies()
      .pipe(finalize(() => this.loadingSignal.set(false)))
      .subscribe({
        next: (response) => this.moviesSignal.set(response.results),
        error: () => this.moviesSignal.set([]),
      });
  }

  loadMovie(id: number): void {
    this.loadingSignal.set(true);
    this.moviesService
      .getMovie(id)
      .pipe(finalize(() => this.loadingSignal.set(false)))
      .subscribe({
        next: (movie) => this.selectedMovieSignal.set(movie),
        error: () => this.selectedMovieSignal.set(null),
      });
  }

  searchMovies(query: string): void {
    this.searchQuerySignal.set(query);
    if (!query.trim()) {
      this.searchResultsSignal.set([]);
      return;
    }

    this.loadingSignal.set(true);
    this.moviesService
      .searchMovies(query)
      .pipe(finalize(() => this.loadingSignal.set(false)))
      .subscribe({
        next: (response) => this.searchResultsSignal.set(response.results),
        error: () => this.searchResultsSignal.set([]),
      });
  }
}
