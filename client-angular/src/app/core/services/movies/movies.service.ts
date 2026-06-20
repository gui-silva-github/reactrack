import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs";
import { MOVIES_URLS, TMDB_IMG_API } from "../../constants/api-urls";
import {
  IMovieData,
  IMoviesResponse,
  ISpecificMovieData
} from '../../models/systems/movies/movies.model';

const TMDB_API_KEY = '98ed7a779207964f1c32554ed9de1c17';

@Injectable({ providedIn: 'root' })
export class MoviesService {
  readonly imgApi = TMDB_IMG_API;

  constructor(private http: HttpClient) {}

  getPopularMovies(): Observable<IMoviesResponse> {
    const params = new HttpParams().set('api_key', TMDB_API_KEY);
    return this.http.get<IMoviesResponse>(MOVIES_URLS.popular, { params });
  }

  getMovie(id: number): Observable<ISpecificMovieData> {
    const params = new HttpParams().set('api_key', TMDB_API_KEY);
    return this.http.get<ISpecificMovieData>(MOVIES_URLS.movie(id), { params });
  }

  searchMovies(query: string): Observable<IMoviesResponse> {
    const params = new HttpParams()
      .set('api_key', TMDB_API_KEY)
      .set('query', query);
    return this.http.get<IMoviesResponse>(MOVIES_URLS.search, { params });
  }

  getTopRatedMovies(): Observable<{ results: IMovieData[] }> {
    const params = new HttpParams().set('api_key', TMDB_API_KEY);
    return this.http.get<{ results: IMovieData[] }>(
      `${MOVIES_URLS.popular.replace('/popular', '/top_rated')}`,
      { params }
    );
  }
}
