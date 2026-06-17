import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/investments/investments').then(m => m.Investments)
  }
];

















