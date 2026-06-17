import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(m => m.Home)
  },
  {
    path: 'movie/:id',
    loadComponent: () => import('./pages/movie/movie').then(m => m.Movie)
  },
  {
    path: 'search',
    loadComponent: () => import('./pages/search/search').then(m => m.Search)
  }
];
















