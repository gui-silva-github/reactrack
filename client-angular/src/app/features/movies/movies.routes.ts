import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/movies-layout').then((m) => m.MoviesLayout),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home').then((m) => m.Home),
      },
      {
        path: 'search',
        loadComponent: () => import('./pages/search/search').then((m) => m.Search),
      },
      {
        path: 'movie/:id',
        loadComponent: () => import('./pages/movie/movie').then((m) => m.Movie),
      },
    ],
  },
];
