import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/fit/fit.component').then(m => m.FitComponent)
  },
  {
    path: 'exercise/:id',
    loadComponent: () => import('./pages/exercise-detail/exercise-detail.component').then(m => m.ExerciseDetailComponent)
  }
];

















