export const EXERCISE_DB_URL = 'https://www.exercisedb.dev/api/v1';
export const MUSCLE_WIKI_URL = 'https://musclewiki.com/exercises/male';

export const FIT_URLS = {
  bodyPartList: `${EXERCISE_DB_URL}/bodyparts`,
  exercisesList: `${EXERCISE_DB_URL}/exercises`,
  bodyPartSpecific: `${EXERCISE_DB_URL}/bodyparts/`,
  searchExercise: `${EXERCISE_DB_URL}/exercises?&search=`,
  exerciseSpecific: `${EXERCISE_DB_URL}/exercises/`,
  targetMuscle: `${EXERCISE_DB_URL}/muscles/`,
  equipment: `${EXERCISE_DB_URL}/equipments/`,
  similarExercises: `${EXERCISE_DB_URL}/exercises/search?q=`,
  muscleWikiUrl: MUSCLE_WIKI_URL,
} as const;

export const COINGECKO_URL = 'https://api.coingecko.com/api/v3';

export const CRYPTO_URLS = {
  markets: `${COINGECKO_URL}/coins/markets`,
  coin: (id: string) => `${COINGECKO_URL}/coins/${id}`,
  marketChart: (id: string) => `${COINGECKO_URL}/coins/${id}/market_chart`,
} as const;

export const OPINLY_URL = 'http://localhost:3010';

export const OPINLY_URLS = {
  loadOpinions: `${OPINLY_URL}/opinions`,
  saveOpinions: `${OPINLY_URL}/opinions`,
  upvote: (id: string) => `${OPINLY_URL}/opinions/${id}/upvote`,
  downvote: (id: string) => `${OPINLY_URL}/opinions/${id}/downvote`,
} as const;

export const TMDB_API = 'https://api.themoviedb.org/3';
export const TMDB_IMG_API = 'https://image.tmdb.org/t/p/w500/';

export const MOVIES_URLS = {
  popular: `${TMDB_API}/movie/popular`,
  movie: (id: number) => `${TMDB_API}/movie/${id}`,
  search: `${TMDB_API}/search/movie`,
} as const;

export const CONVENE_URL = 'http://localhost:3003';
export const CONVENE_URLS = {
  events: `${CONVENE_URL}/events`,
  event: (id: string) => `${CONVENE_URL}/events/${id}`,
  images: `${CONVENE_URL}/images`,
} as const;

export const GITHUB_API = 'https://api.github.com/users';
export const GITHUB_PROFILE_URL = 'https://github.com/';

export const TALKIVE_REDIRECT_URL = '/systems/talkive';
