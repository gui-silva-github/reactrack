import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/opinly/opinly').then(m => m.Opinly)
  }
]














