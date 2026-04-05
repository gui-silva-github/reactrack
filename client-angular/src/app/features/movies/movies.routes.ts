import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.MoviesHomeComponent)
  },
  {
    path: 'movie/:id',
    loadComponent: () => import('./pages/movie/movie.component').then(m => m.MovieComponent)
  },
  {
    path: 'search',
    loadComponent: () => import('./pages/search/search.component').then(m => m.SearchComponent)
  }
];

















