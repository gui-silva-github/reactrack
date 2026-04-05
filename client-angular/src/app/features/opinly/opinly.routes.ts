import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/opinly/opinly.component').then(m => m.OpinlyComponent)
  }
];

















