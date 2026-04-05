import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/investments/investments.component').then(m => m.InvestmentsComponent)
  }
];

















