export interface IMoviesResponse {
  page: number;
  results: IMovieData[];
  total_pages: number;
  total_results: number;
}

export interface IMovieData {
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: false;
  vote_average: number;
  vote_count: number;
}

export interface IGenreData {
  id: number;
  name: string;
}

export interface ISpecificMovieData {
  backdrop_path: string;
  belongs_to_collection: {
    id: number;
    name: string;
    poster_path: string;
    backdrop_path: string;
  };
  budget: number;
  genres: IGenreData[];
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  revenue: number;
  runtime: number;
  status: string;
  tagline: string;
  vote_average: number;
  vote_count: number;
}
