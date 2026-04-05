import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

const TMDB_API = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = '98ed7a779207964f1c32554ed9de1c17';
const TMDB_IMG_API = 'https://image.tmdb.org/t/p/w500/';

export interface IMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  tagline?: string;
  budget?: number;
  revenue?: number;
  runtime?: number;
  [key: string]: any;
}

export interface IMovieSearchResponse {
  results: IMovie[];
  total_results: number;
  total_pages: number;
}

@Injectable({
  providedIn: 'root'
})
export class MoviesService {
  readonly imgApi = TMDB_IMG_API;

  constructor(private http: HttpClient) {}

  getPopularMovies(): Observable<{ results: IMovie[] }> {
    const params = new HttpParams().set('api_key', TMDB_API_KEY);
    return this.http.get<{ results: IMovie[] }>(`${TMDB_API}/movie/popular`, { params });
  }

  getMovie(id: number): Observable<IMovie> {
    const params = new HttpParams().set('api_key', TMDB_API_KEY);
    return this.http.get<IMovie>(`${TMDB_API}/movie/${id}`, { params })
  }

  searchMovies(query: string): Observable<IMovieSearchResponse> {
    const params = new HttpParams()
      .set('api_key', TMDB_API_KEY)
      .set('query', query)
    return this.http.get<IMovieSearchResponse>(`${TMDB_API}/search/movie`, { params });
  }
}
